import FormSubscribe from "../../common/FormSubscribe";
import Articles from "../../common/Articles";
import Create from "./sections/Create";
import Details from "./sections/Details";
import FeatureProducts from "./sections/FeatureProducts";
import Hero from "./sections/Hero";
import Lookbook from "./sections/Lookbook";
import Native from "./sections/Native";

export default function Home() {
	return (<>
		<Hero />
		<Create />
		<FeatureProducts />
		<Native />
		<Lookbook />
		<FeatureProducts _isDark={true} />
		<Details />
		<Articles />
		<FormSubscribe />
	</>);
}