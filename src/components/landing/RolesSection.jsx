// src/components/landing/RolesSection.jsx

import Container from "../common/Container";

import SectionTitle from "../common/SectionTitle";

import { userRoles } from "../../constants/landingData";

export default function RolesSection() {
    return (
        <section className="py-24 bg-slate-900/40">

            <Container>

                <SectionTitle
                    badge="Built For Everyone"
                    title="Designed For Every Role"
                    description="
                        Whether you're hosting, competing, mentoring,
                        or judging — HackForge has specialized workflows
                        for every user role.
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

                    {userRoles.map((role) => {

                        const Icon = role.icon;

                        return (
                            <div
                                key={role.id}
                                className="
                                    rounded-3xl
                                    border
                                    border-slate-800
                                    bg-slate-950/60
                                    p-8
                                    hover:border-indigo-500/40
                                    transition-all
                                "
                            >

                                <div
                                    className="
                                        w-16
                                        h-16
                                        rounded-2xl
                                        bg-indigo-500/10
                                        text-indigo-400
                                        flex
                                        items-center
                                        justify-center
                                        text-2xl
                                        mb-6
                                    "
                                >
                                    <Icon />
                                </div>

                                <h3 className="text-2xl font-semibold mb-4">
                                    {role.title}
                                </h3>

                                <p className="text-slate-400 leading-relaxed">
                                    {role.description}
                                </p>

                            </div>
                        );
                    })}

                </div>

            </Container>

        </section>
    );
}