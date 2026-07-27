// src/components/landing/FeaturesSection.jsx

import SectionTitle from "../common/SectionTitle";

import FeatureCard from "./FeatureCard";

import { platformFeatures } from "../../constants/landingData";

import Container from "../common/Container";

export default function FeaturesSection() {
    return (
        <section className="py-24">

            <Container>

                <SectionTitle
                    badge="Platform Features"
                    title="Everything You Need To Run A Hackathon"
                    description="
                        Powerful tools for organizers, participants,
                        judges, and mentors — all in one platform.
                    "
                />

                <div
                    className="
                        grid
                        md:grid-cols-2
                        lg:grid-cols-3
                        gap-8
                    "
                >

                    {platformFeatures.map((feature) => (
                        <FeatureCard
                            key={feature.id}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}

                </div>

            </Container>

        </section>
    );
}