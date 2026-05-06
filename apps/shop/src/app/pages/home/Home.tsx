import FormSubscribe from "../../common/FormSubscribe";
import Articles from "../../common/Articles";
import Create from "./sections/Create";
import Details from "./sections/Details";
import FeatureProducts from "./sections/FeatureProducts";
import Hero from "./sections/Hero";
import Lookbook from "./sections/Lookbook";
import Native from "./sections/Native";
import ProductCard from "../../../../../../libs/ui/src/lib/cards/ProductCard";
import View from "./sections/View";

export default function Home() {
	return (<>
		<Hero />
		<Create />
		<FeatureProducts children={[ 1, 56, 32, 61, 19, 22, 44, 9 ]}></FeatureProducts>
		<Native />
		<View ids={[18, 15]}/>
		<Lookbook />
		<FeatureProducts _isDark={true} children={[ 5, 36, 17, 52, 28, 41, 67, 14 ]}></FeatureProducts>
		<Details />
		<Articles />
		<FormSubscribe />
	</>);
}