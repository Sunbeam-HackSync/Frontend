// /src/pages/public/AboutPage.jsx

import Container from "../../components/common/Container";
import SectionTitle from "../../components/common/SectionTitle";
import Button from "../../components/ui/Button";
import { SectionHeading, SectionDescription } from "../../components/common/Typography";

export default function AboutPage() {
    const team = [
        { name: "Asha Rao", role: "Founder & CEO" },
        { name: "Diego Mar", role: "Head of Engineering" },
        { name: "Lina Patel", role: "Design Lead" },
    ];

    return (
        <div className="py-20">

            <Container>
                <SectionTitle
                    badge="About"
                    title="We build great hackathon experiences"
                    description="Sunbeam is a lightweight platform that helps organizers run engaging, fair, and memorable hackathons — from registration to judging and post-event highlights."
                />
            </Container>

            <Container className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <SectionHeading>Our mission</SectionHeading>
                        <SectionDescription className="mt-4">
                            We believe in empowering creators by removing operational friction. Our goal is to make
                            hackathons easier to organize and more delightful to participate in — giving people
                            time to focus on building great things.
                        </SectionDescription>

                        <ul className="mt-6 space-y-3 text-left text-slate-500">
                            <li>• Simple workflows for organizers</li>
                            <li>• Fair, customizable judging</li>
                            <li>• Clear onboarding for participants and mentors</li>
                        </ul>

                        <div className="mt-8">
                            <Button variant="primary">Get in touch</Button>
                        </div>
                    </div>

                    <div>
                        <div className="w-full h-64 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-300 flex items-center justify-center text-white">
                            <div className="max-w-sm text-center px-6">
                                <h3 className="text-2xl font-semibold">Built for communities</h3>
                                <p className="mt-3 text-slate-100">Tools and workflows crafted from real event experience.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            <Container className="mt-20">
                <div className="text-center max-w-3xl mx-auto mb-8">
                    <h3 className="text-3xl font-bold">The team</h3>
                    <p className="mt-3 text-slate-400">A small cross-functional team passionate about events and developer tooling.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {team.map((member) => (
                        <div key={member.name} className="p-6 bg-white/5 rounded-xl text-center">
                            <div className="mx-auto w-20 h-20 rounded-full bg-indigo-600/20 flex items-center justify-center text-xl font-semibold text-indigo-600">
                                {member.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                            </div>
                            <h4 className="mt-4 font-semibold">{member.name}</h4>
                            <div className="text-sm text-slate-400">{member.role}</div>
                        </div>
                    ))}
                </div>
            </Container>

            <Container className="mt-20">
                <div className="rounded-xl p-8 bg-gradient-to-r from-indigo-50 to-white border border-indigo-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h4 className="text-2xl font-bold">Want to collaborate?</h4>
                            <p className="text-slate-500 mt-2">We'd love to hear about your event and how we can help.</p>
                        </div>
                        <div>
                            <Button variant="outline">Contact us</Button>
                        </div>
                    </div>
                </div>
            </Container>

        </div>
    );
}