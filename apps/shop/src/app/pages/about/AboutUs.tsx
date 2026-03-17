import FormSubscribe from "../../common/FormSubscribe";
import About from "./sections/About";
import Details from "./sections/Details";
import Features from "./sections/Features";
import Hero from "./sections/Hero";
import Native from "./sections/Native";
import Team from "./sections/Team";

export default function AboutUs() {
	return (<>
		<Hero />
		<About />
		<Native />
		<Details />
		<Features />
		<Team />
		<FormSubscribe />
	</>);
}