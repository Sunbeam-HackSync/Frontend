// /src/pages/public/LandingPage.jsx

import HeroSection from "../../components/landing/HeroSection";

import FeaturesSection from "../../components/landing/FeaturesSection";

import RolesSection from "../../components/landing/RolesSection";

import FeaturedHackathons from "../../components/landing/FeaturedHackathons";

import CTASection from "../../components/landing/CTASection";

import TestimonialsSection from "../../components/landing/TestimonialsSection";

import SponsorsSection from "../../components/landing/SponsorsSection";

export default function LandingPage() {
    return (
        <>
            <HeroSection />

            <FeaturesSection />

            <RolesSection />

            <FeaturedHackathons />

            <TestimonialsSection />

            <CTASection />

            <SponsorsSection />
        </>
    );
}