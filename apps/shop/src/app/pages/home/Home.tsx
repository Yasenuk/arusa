import { lazy, Suspense } from "react";

import FormSubscribe from "../../common/FormSubscribe";
import Articles from "../../common/Articles";
import Hero from "./sections/Hero";
import Create from "./sections/Create";
import Native from "./sections/Native";

const FeatureProducts = lazy(() => import("./sections/FeatureProducts"));
const View = lazy(() => import("./sections/View"));
const Lookbook = lazy(() => import("./sections/Lookbook"));
const Details = lazy(() => import("./sections/Details"));

const SectionFallback = () => <div style={{ minHeight: "40vh" }} aria-hidden="true" />;

export default function Home() {
	return (<>
		<Hero />
		<Create />
		<Suspense fallback={<SectionFallback />}>
			<FeatureProducts children={[ 1, 56, 32, 61, 19, 22, 44, 9 ]} />
		</Suspense>
		<Native />
		<Suspense fallback={<SectionFallback />}>
			<View ids={[18, 15]} />
		</Suspense>
		<Suspense fallback={<SectionFallback />}>
			<Lookbook />
		</Suspense>
		<Suspense fallback={<SectionFallback />}>
			<FeatureProducts _isDark={true} children={[ 5, 36, 17, 52, 28, 41, 67, 14 ]} />
		</Suspense>
		<Suspense fallback={<SectionFallback />}>
			<Details />
		</Suspense>
		<Articles />
		<FormSubscribe />
	</>);
}