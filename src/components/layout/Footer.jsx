// /src/components/layout/Footer.jsx

import Container from "../common/Container";

export default function Footer() {
    return (
        <footer className="border-t border-slate-800 py-10">

            <Container>

                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        items-center
                        justify-between
                        gap-4
                    "
                >

                    <h2 className="text-xl font-bold">
                        Hack<span className="text-indigo-500">Sync</span>
                    </h2>

                    <p className="text-slate-400 text-sm">
                        © 2026 HackSync. All rights reserved.
                    </p>

                </div>

            </Container>

        </footer>
    );
}