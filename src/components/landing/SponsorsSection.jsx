// src/components/landing/SponsorsSection.jsx

import Container from "../common/Container";

const sponsors = [
    "Google",
    "Microsoft",
    "GitHub",
    "AWS",
    "OpenAI"
];

export default function SponsorsSection() {
    return (
        <section className="py-10 border-y border-slate-800">

            <Container>

                <div
                    className="
                        flex
                        flex-wrap
                        justify-center
                        items-center
                        gap-10
                    "
                >

                    {sponsors.map((sponsor) => (
                        <div
                            key={sponsor}
                            className="
                                text-2xl
                                font-bold
                                text-slate-500
                                hover:text-slate-300
                                transition
                            "
                        >
                            {sponsor}
                        </div>
                    ))}

                </div>

            </Container>

        </section>
    );
}