// src/components/landing/CTASection.jsx

import Container from "../common/Container";

import Button from "../ui/Button";

import { useNavigate } from "react-router";

export default function CTASection() {
    const navigate = useNavigate();
    return (
        <section className="py-24">

            <Container>

                <div
                    className="
                        relative
                        overflow-hidden
                        rounded-[40px]
                        border
                        border-indigo-500/20
                        bg-linear-to-br
                        from-indigo-600
                        to-cyan-600
                        px-8
                        py-20
                        text-center
                    "
                >

                    <div
                        className="
                            absolute
                            inset-0
                            bg-black/10
                        "
                    />

                    <div className="relative z-10">

                        <h2
                            className="
                                text-4xl
                                md:text-5xl
                                font-bold
                                leading-tight
                            "
                        >
                            Ready To Launch Your Next Hackathon?
                        </h2>

                        <p
                            className="
                                mt-6
                                text-lg
                                text-indigo-100
                                max-w-2xl
                                mx-auto
                            "
                        >
                            Join thousands of developers, organizers,
                            and innovators building the future through
                            collaborative hackathons.
                        </p>

                        <div
                            className="
                                flex
                                flex-wrap
                                justify-center
                                gap-4
                                mt-10
                            "
                        >

                            <Button className=" bg-blue-600 hover:bg-blue-700">
                                Start Hosting
                            </Button>

                            <Button
                                variant="secondary"
                                className="bg-white/10 border-white/20"
                                onClick={() => {
                                    navigate("/hackathons");
                                }}
                            >
                                Explore Events
                            </Button>

                        </div>

                    </div>

                </div>

            </Container>

        </section>
    );
}