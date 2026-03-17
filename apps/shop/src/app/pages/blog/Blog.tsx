import Articles from "../../common/Articles";
import FormSubscribe from "../../common/FormSubscribe";
import Hero from "./sections/Hero";
import MoreArticles from "./sections/MoreArticles";

export default function Blog() {
	return (<>
		<Hero />
		<Articles />
		<MoreArticles />
		<FormSubscribe />
	</>);
}