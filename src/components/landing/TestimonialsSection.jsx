// src/components/landing/TestimonialsSection.jsx

import Container from "../common/Container";

import SectionTitle from "../common/SectionTitle";

const testimonials = [
    {
        id: 1,
        name: "Rahul Sharma",
        role: "Hackathon Organizer",
        feedback:
            "HackForge completely transformed the way we manage hackathons and judging workflows."
    },
    {
        id: 2,
        name: "Priya Verma",
        role: "Participant",
        feedback:
            "The team collaboration and submission system made our experience incredibly smooth."
    },
    {
        id: 3,
        name: "Ankit Patel",
        role: "Judge",
        feedback:
            "Clean evaluation dashboards and rubric scoring saved hours during project reviews."
    }
];

export default function TestimonialsSection() {
    return (
        <section className="section-padding">

            <Container>

                <SectionTitle
                    badge="Community Feedback"
                    title="Loved By Developers & Organizers"
                    description="
                        Thousands of innovators trust HackForge
                        to run and participate in world-class hackathons.
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

                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="
                                glass-card
                                rounded-3xl
                                p-8
                            "
                        >

                            <p
                                className="
                                    text-slate-300
                                    leading-relaxed
                                    mb-8
                                "
                            >
                                "
                                {testimonial.feedback}
                                "
                            </p>

                            <div>

                                <h4 className="font-semibold text-lg">
                                    {testimonial.name}
                                </h4>

                                <p className="text-slate-400 text-sm">
                                    {testimonial.role}
                                </p>

                            </div>

                        </div>
                    ))}

                </div>

            </Container>

        </section>
    );
}