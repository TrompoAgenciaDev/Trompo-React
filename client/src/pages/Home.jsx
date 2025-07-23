import Hero from "../layout/Hero";
import Portfolio from '../layout/Portfolio.jsx';
import News from "../layout/News.jsx";
import Contact from "../layout/Contact.jsx";
import About from "../layout/About.jsx";

const Home = () => {
  return (
    <main>
      <Hero/>
      <About/>
      <Portfolio/>
      <News/>
      <Contact/>
    </main>
  );
};

export default Home;