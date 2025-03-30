import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import "swiper/css";
import {teamMembers} from '../data/miembros';
import {cardsData} from '../data/viajes';
import { MailCheckIcon } from "../icons/mail-check";
import {Link} from "react-router-dom";

export default function Home() {

  const [open, setOpen] = useState(false);
  const initialSlide = 1;
  const [activeIndex, setActiveIndex] = useState(initialSlide);
  const [itineraryHeight, setItineraryHeight] = useState(0);
  const itineraryRefs = useRef<(HTMLDivElement | null)[]>([]);

  const animationRef = useRef<number | null>(null); // Properly typed
  const animationStartTime = useRef<number>(0);

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.realIndex);
  };

  /*  Agrega Margin Bottom a la sección de experiencias para evitar que se encimen*/
  useEffect(() => {
    if (open) {
      // Start animation
      animationStartTime.current = performance.now();
      const animate = (time: number) => {
        const elapsed = time - animationStartTime.current;
        const progress = Math.min(elapsed / 100, 1); // 500ms matches your CSS animation

        const currentRef = itineraryRefs.current[activeIndex];
        if (currentRef) {
          // Get the full height (this might need adjustment based on your actual layout)
          const fullHeight = currentRef.scrollHeight;
          const adjustedHeight = fullHeight * progress;
          // Apply the current height based on animation progress
          setItineraryHeight(adjustedHeight);
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Close animation
      setItineraryHeight(0);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [open, activeIndex]);

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]); // Array of section refs
  const sections = ["landing", "proposito", "viajes"];

  const handleNavbarClick = (section: string) => {
    const index = sections.indexOf(section);
    const targetSection = sectionRefs.current[index];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main>
      <div /* Landing */
        className="landing"
        ref={(el) => {
          sectionRefs.current[0] = el;
        }}
      >
        <header className="navbar">
          <p
            className="navbarTitle"
            onClick={() => handleNavbarClick("landing")}
          >
            TravelCoin
          </p>
          <nav className="navbarMenu">
            <div
              className="navbarItem"
              onClick={() => handleNavbarClick("proposito")}
            >
              Proposito
            </div>
            <div
              className="navbarItem"
              onClick={() => handleNavbarClick("viajes")}
            >
              Viajes
            </div>
            <div className="flex items-center justify-center gap-2">
              <SignedIn>
                <Link className="navbarItem" to={"/dashboard"}>Dashboard</Link>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton>Inicia Sesion</SignInButton>
              </SignedOut>
            </div>
          </nav>
        </header>

        <video
          className="landingVideo"
          loop
          muted
          autoPlay
          controls={false}
          src="agave1.webm"
        />

        <div className="landingCont">
          <div className="landingTitle">TravelCoin</div>
          <div className="landingText">
            Descubre Travelcoin, la plataforma que revoluciona el turismo al
            recompensarte con tokens por cada aventura. Canjea tus Travelcoins
            por descuentos en viajes, experiencias únicas o conviértelos en
            criptomonedas, todo con la seguridad y transparencia de la
            tecnología blockchain. Únete a la nueva era del turismo digital y
            viaja más, gastando menos 🚀🌍
          </div>
          <div
            onClick={() => handleNavbarClick("proposito")}
            className="landingBtn"
          >
            Conoce Más
          </div>
        </div>
      </div>

      <div /* Proposito, AboutUS & Problematica */
        className="aboutUsSection"
        ref={(el) => {
          sectionRefs.current[1] = el;
        }}
      >
        <div className="quienesSomos">¿Quienes somos?</div>
        <div className="quienesSomosDesc">
          Somos un equipo apasionado por la innovación y la tecnología,
          comprometidos con transformar la industria del turismo a través de
          soluciones basadas en blockchain. Con Travelcoin, buscamos crear
          experiencias de viaje más accesibles, seguras y gratificantes para
          todos.
        </div>
        <div className="teamMembers">
          {teamMembers.map((member: any, index: any) => (
            <div key={index} className="teamMember">
              <img
                className="teamImg"
                src={`/pfps/${member.pfp}.webp`}
                alt={member.name}
              />
              <div className="teamText">
                <h2 className="font-semibold">{member.name}</h2>
                <h3>
                  <a className="teamContacto" href={`mailto:${member.contact}`}>
                    <MailCheckIcon />
                  </a>
                </h3>
              </div>
            </div>
          ))}
        </div>

        <Swiper
          className="teamSlider"
          slidesPerView={"auto"}
          centeredSlides
          initialSlide={initialSlide}
          spaceBetween={10}
          slideToClickedSlide={true}
        >
          {teamMembers.map((member: any, index: any) => (
            <SwiperSlide key={index} className="teamSlide">
              <img
                className="teamImg"
                src={`/pfps/${member.pfp}.webp`}
                alt={member.name}
              />
              <div className="teamSliderText">
                <h3>{member.name}</h3>
                <h3>
                  <a className="teamContacto" href={`mailto:${member.contact}`}>
                    <img className="teamIcon" src="/icons/mail.webp" />
                  </a>
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="problematicaCont">
          <div className="problematica">
            <img className="problematicaImg" src="mexico.webp" />

            <div className="problematicaTexto">
              <div className="problematicaTitulo">Problematica</div>
              El turismo enfrenta desafíos como la falta de incentivos
              atractivos, costos elevados y la dificultad para encontrar
              experiencias auténticas y certificadas. Los programas de
              recompensas tradicionales son rígidos y poco flexibles, limitando
              el acceso a beneficios reales para los viajeros. Travelcoin aborda
              este problema integrando tecnología Web3 y blockchain para crear
              un ecosistema de recompensas transparente, seguro y
              descentralizado. A través de tokens, los viajeros pueden obtener
              incentivos al completar actividades, usarlos para descuentos en
              servicios turísticos o convertirlos en criptomonedas, con la
              garantía de que cada viaje, experiencia e itinerario están
              verificados y certificados, eliminando intermediarios y
              permitiendo transacciones globales sin restricciones.
            </div>
          </div>
          <img className="problematicaBg" src="bg.jpg" />
        </div>
      </div>

      <div /* Experiancias, Viajes e Itinerarios */
        ref={(el) => {
          sectionRefs.current[2] = el;
        }}
        className="section"
        style={{
          marginBottom: `${itineraryHeight}px`,
        }}
      >
        <Swiper
          slidesPerView={"auto"}
          centeredSlides
          initialSlide={initialSlide}
          spaceBetween={0}
          onSlideChange={handleSlideChange}
          slideToClickedSlide={true}
        >
          {cardsData.map((card: any, index: any) => {
            const distance = Math.abs(activeIndex - index);
            const scale = 1 - distance * 0.1;

            return (
              <SwiperSlide className="slide" key={index}>
                <div
                  className="card"
                  style={{
                    background: card.backgroundColor,
                    transform: `scale(${scale})`,
                  }}
                >
                  <div>
                    <img className="cardImg" src={card.img} alt={card.title} />
                    <div className="cardContent">
                      <div className="cardTitle">{card.title}</div>
                      <div className="cardDesc">{card.desc}</div>
                    </div>
                  </div>

                  <div className="cardBottom">
                    <div className="cardBtn" onClick={() => setOpen(!open)}>
                      Ver más
                    </div>
                    <div
                      ref={(el) => (itineraryRefs.current[index] = el)}
                      className={
                        activeIndex === index && open
                          ? "itinerario"
                          : "itinerarioColapsado"
                      }
                    >
                      <div className="itinerarioTitulo">Itinerario</div>
                      {card.itinerary.map((activity: any, activityIndex: any) => (
                        <div className="actividad" key={activityIndex}>
                          <div className="actividadTop">
                            <div className="actividadTitulo">
                              {activity.title}
                            </div>
                            <div className="actividadEstatus">
                              {activity.status}
                            </div>
                          </div>
                          <div>{activity.desc}</div>
                        </div>
                      ))}
                      <div className="cardBtn" onClick={() => setOpen(!open)}>
                        Cerrar
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </main>
    );
}