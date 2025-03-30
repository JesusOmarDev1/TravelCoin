import Time "mo:base/Time";
module types {
   // Estados para viajes, actividades y reservas
   public type EstadoViaje = {
      #Pendiente;
      #EnCurso;
      #Completado;
      #Cancelado;
   };

   public type EstadoActividad = {
      #Pendiente;
      #EnCurso;
      #Completado;
      #Cancelado;
   };

   public type EstadoReserva = {
      #Pendiente;
      #Confirmada;
      #Cancelada;
      #Finalizada;
   };

   // Tipos para el sistema de recompensas
   public type TipoRecompensa = {
      #Tokens;
      #Descuento;
      #BeneficioExclusivo;
   };

   // Tipos para transacciones de tokens
   public type TransaccionToken = {
      id : Nat;
      usuario : Principal;
      tipo : { #ganancia; #canje; #transferencia };
      cantidad : Nat;
      fecha : Time.Time;
      estado : EstadoTransaccion;
   };

   public type EstadoTransaccion = {
      #Completada;
      #Fallida : MotivoFallo;
      #Pendiente;
   };

   public type MotivoFallo = {
      #FondosInsuficientes;
      #LimiteExcedido;
      #TiempoExpirado;
      #ErrorValidacion;
      #Otro : Text;
   };
};
