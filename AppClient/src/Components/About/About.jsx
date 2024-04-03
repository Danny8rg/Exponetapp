import "./About.css";

function About() {
  const scrollToSection = () => {
    const section = document.getElementById("about-info");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <section className="about-container">
        <h1 className="about-title mb-3">
          Descubre y apoya a las microempresas locales
        </h1>
        <p className="about-txt">
          ¡En ExpoNet explora productos únicos, apoya tu comunidad y celebra lo
          mejor de tu ciudad en un solo lugar!
        </p>
        <button
          onClick={scrollToSection}
          className="flex w-40 justify-center rounded-md px-3 py-1 text-sm font-semibold no-underline leading-6 text-white shadow-sm btn-about"
        >
          Saber más
        </button>
      </section>
    </>
  );
}

export default About;
