import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Buffer "mo:base/Buffer";
import types "types";

actor TravelCoin {

  // ========== TIPOS PRINCIPALES ==========
  type Viaje = {
    id : Nat;
    titulo : Text;
    descripcion : Text;
    destino : Text;
    fechaInicio : Time.Time;
    fechaFin : Time.Time;
    precio : Float;
    cupoMaximo : Nat;
    inscritos : [Principal];
    estado : types.EstadoViaje;
    tokensRecompensa : Nat;
  };

  type Actividad = {
    id : Nat;
    viajeId : Nat;
    titulo : Text;
    descripcion : Text;
    estado : types.EstadoActividad;
    tokensRecompensa : Nat;
    requiereVerificacion : Bool;
  };

  type Usuario = {
    id : Principal;
    nombre : ?Text;
    tokens : Nat;
    historialViajes : [Nat];
    historialActividades : [Nat];
  };

  type Reserva = {
    id : Nat;
    usuario : Principal;
    viajeId : Nat;
    actividades : [Nat];
    fecha : Time.Time;
    estado : types.EstadoReserva;
  };

  // ========== ESTADO DEL SISTEMA ==========
  stable var nextViajeId : Nat = 1;
  stable var nextActividadId : Nat = 1;
  stable var nextReservaId : Nat = 1;
  stable var nextTransaccionId : Nat = 1;

  stable var viajes : [Viaje] = [];
  stable var actividades : [Actividad] = [];
  stable var usuarios : [Usuario] = [];
  stable var reservas : [Reserva] = [];
  stable var transacciones : [types.TransaccionToken] = [];

  // ========== FUNCIONES PRINCIPALES ==========

  // Registrar nuevo usuario
  public shared ({ caller }) func registrarUsuario(nombre : ?Text) : async Result.Result<Usuario, Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("No se permiten usuarios anónimos");
    };

    switch (getUsuario(caller)) {
      case (null) {
        let nuevoUsuario : Usuario = {
          id = caller;
          nombre = nombre;
          tokens = 0;
          historialViajes = [];
          historialActividades = [];
        };
        usuarios := Array.append(usuarios, [nuevoUsuario]);
        #ok(nuevoUsuario);
      };
      case (_) { #err("El usuario ya existe") };
    };
  };

  // Crear nuevo viaje (solo administradores)
  public shared ({ caller }) func crearViaje(
    titulo : Text,
    descripcion : Text,
    destino : Text,
    fechaInicio : Time.Time,
    fechaFin : Time.Time,
    precio : Float,
    cupoMaximo : Nat,
    tokensRecompensa : Nat,
  ) : async Result.Result<Viaje, Text> {
    if (not esAdministrador(caller)) {
      return #err("Acceso denegado: se requieren privilegios de administrador");
    };

    let nuevoViaje : Viaje = {
      id = nextViajeId;
      titulo = titulo;
      descripcion = descripcion;
      destino = destino;
      fechaInicio = fechaInicio;
      fechaFin = fechaFin;
      precio = precio;
      cupoMaximo = cupoMaximo;
      inscritos = [];
      estado = #Pendiente;
      tokensRecompensa = tokensRecompensa;
    };

    viajes := Array.append(viajes, [nuevoViaje]);
    nextViajeId += 1;
    #ok(nuevoViaje);
  };

  // Reservar viaje
  public shared ({ caller }) func reservarViaje(viajeId : Nat) : async Result.Result<Text, Text> {
    switch (getUsuario(caller), getViaje(viajeId)) {
      case (?usuario, ?viaje) {
        if (viaje.estado != #Pendiente) {
          return #err("El viaje no está disponible para reservación");
        };

        if (viaje.inscritos.size() >= viaje.cupoMaximo) {
          return #err("No hay cupo disponible");
        };

        if (Array.find(viaje.inscritos, func(p : Principal) : Bool { p == caller }) != null) {
          return #err("Ya estás inscrito en este viaje");
        };

        // Actualizar viaje
        let nuevosInscritos = Array.append(viaje.inscritos, [caller]);
        viajes := Array.map(
          viajes,
          func(v : Viaje) : Viaje {
            if (v.id == viajeId) { { v with inscritos = nuevosInscritos } } else {
              v;
            };
          },
        );

        // Crear reserva
        let nuevaReserva : Reserva = {
          id = nextReservaId;
          usuario = caller;
          viajeId = viajeId;
          actividades = [];
          fecha = Time.now();
          estado = #Confirmada;
        };
        reservas := Array.append(reservas, [nuevaReserva]);
        nextReservaId += 1;

        // Registrar transacción de tokens
        let nuevaTransaccion : types.TransaccionToken = {
          id = nextTransaccionId;
          usuario = caller;
          tipo = #ganancia;
          cantidad = viaje.tokensRecompensa;
          fecha = Time.now();
          estado = #Completada;
        };
        transacciones := Array.append(transacciones, [nuevaTransaccion]);
        nextTransaccionId += 1;

        // Actualizar usuario
        usuarios := Array.map(
          usuarios,
          func(u : Usuario) : Usuario {
            if (u.id == caller) {
              {
                u with
                tokens = u.tokens + viaje.tokensRecompensa;
                historialViajes = Array.append(u.historialViajes, [viajeId]);
              };
            } else { u };
          },
        );

        #ok("¡Reserva exitosa! Has ganado " # Nat.toText(viaje.tokensRecompensa) # " TravelCoins");
      };
      case (null, _) { #err("Usuario no encontrado") };
      case (_, null) { #err("Viaje no encontrado") };
    };
  };

  // ========== FUNCIONES DE CONSULTA ==========
  public query func obtenerViajes() : async [Viaje] {
    viajes;
  };

  public query func obtenerViajesDisponibles() : async [Viaje] {
    Array.filter(viajes, func(v : Viaje) : Bool { v.estado == #Pendiente });
  };

  public query func obtenerUsuario(principal : Principal) : async ?Usuario {
    getUsuario(principal);
  };

  public query func obtenerBalance(principal : Principal) : async Nat {
    switch (getUsuario(principal)) {
      case (?usuario) { usuario.tokens };
      case null { 0 };
    };
  };

  public query func obtenerTransacciones(principal : Principal) : async [types.TransaccionToken] {
    Array.filter(transacciones, func(t : types.TransaccionToken) : Bool { t.usuario == principal });
  };

  // ========== FUNCIONES AUXILIARES ==========
  func getUsuario(principal : Principal) : ?Usuario {
    Array.find(usuarios, func(u : Usuario) : Bool { u.id == principal });
  };

  func getViaje(id : Nat) : ?Viaje {
    Array.find(viajes, func(v : Viaje) : Bool { v.id == id });
  };

  func esAdministrador(principal : Principal) : Bool {
    // En producción, implementar lógica real de administradores
    let admins = [
      Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai") // Ejemplo
    ];
    Array.find(admins, func(p : Principal) : Bool { p == principal }) != null;
  };
};
