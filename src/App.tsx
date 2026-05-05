import ClickSpark from './components/ClickSpark/ClickSpark';
import DotGrid from './components/DotGrid/DotGrid';
import Folder from './components/Folder/Folder';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import './App.css';


function App() {
  return (
    <>
      <DotGrid
        dotSize={1.5}
        gap={24}
        baseColor="#DBDDDF"
        activeColor="#7F6BFB"
        proximity={250}
        className="dot-grid-bg"
      />
      <ClickSpark sparkColor="#3b82f6" sparkSize={12} sparkRadius={20} sparkCount={10} duration={500}>
        <Hero />
        <About />
        <div className="featured-banner">
          <span className="featured-banner-text">Featured</span>
          <Folder size={1.2} />
          <span className="featured-banner-text">projects</span>
        </div>
        <Projects />
        <Contact />
      </ClickSpark>
    </>
  );
}

export default App;
