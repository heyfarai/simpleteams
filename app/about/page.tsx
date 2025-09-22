import Image from "next/image";
import { generateMetadata as generateSiteMetadata } from "@/lib/metadata";
import { StatCounter } from "@/components/stat-counter";
import { SlidesCarousel } from "@/components/slides-carousel";

export const metadata = generateSiteMetadata({
  title: "About NCHC",
  description:
    "Learn about the National Capital Hoops Circuit - Ottawa's premier basketball league. Discover our story, mission, and commitment to developing elite youth basketball in Canada's capital.",
});

export default function AboutPage() {
  return (
    <div className="mb-18 mt-16 md:mt-24 ">
      {/* Hero Section */}
      <section className="relative py-8 px-4 overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="lg:order-first">
            <Image
              src="/nchh-logo.webp"
              alt="NCHH Logo"
              width={120}
              height={120}
              className="w-full max-w-44 mx-auto"
            />
          </div>
          <div className="heading-highlight-container">
            <h1 className="display-heading mt-8 mb-6 tracking-tight">
              Champions
              <span className="block">
                <span className="text-primary">Rise</span> in the Capital
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* The Story */}
      <section className="py-0 px-8">
        <div className="max-w-3xl mx-auto">
          <div className=" items-center">
            <div>
              <h1 className="hidden font-black lg:text-6xl md:text-3xl text-2xl tracking-tight text-foreground">
                Our (short) Story{" "}
              </h1>
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  Ottawa, the capital city needed a league where elite youth
                  hoopers could be tested and showcase their talent. More than
                  just games, it needed to be a platform for the capital's
                  basketball future.
                </p>
                <p>National Capital Hoops Circuit is that platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Season 1 Success */}
      <section className="py-44 px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-3xl font-normal mb-0 text-center text-foreground">
            <span className="text-primary">Season 1</span>
            <br /> By the Numbers
          </h1>
          <p className="text-lg font-medium md:text-normal mb-16 text-center">
            The stats don't lie
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <StatCounter
              end={21}
              label="Teams (U16-U19)"
              duration={2500}
            />
            <StatCounter
              end={100}
              label="Games Played"
              duration={2800}
            />
            <StatCounter
              end={10000}
              suffix="K+"
              label="Stream Views"
              duration={3000}
            />
          </div>
          <div className="hidden md:grid-cols-2 gap-8">
            <div className=" p-8 rounded-lg shadow-lg">
              <div className="md:text-8xl text-6xl font-extrabold text-primary mb-4 grotesk">
                97%
              </div>
              <p className="text-sm text-gray-700">
                Coaches and team staff called their NCHC experience "excellent".
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="md:text-8xl text-6xl font-extrabold text-primary mb-4 grotesk">
                93%
              </div>
              <p className="text-sm text-gray-700">
                Confirmed they would take part again.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full min-h-screen bg-foreground flex items-center justify-center">
        <div className="max-w-3xl mx-auto px-16">
          <h3 className="text-4xl md:text-4xl font-normal mb-12 text-foreground">
            <span className="text-[#dbe0e1]">
              <span className="text-secondary pr-2 text-5xl md:text-7xl">
                <span className="mutant-outline">97%</span>
              </span>
              of coaches and team staff members called their NCHC experience
              <span className="pl-2 text-secondary"> “excellent”</span>.
            </span>
          </h3>
          <h3 className="text-4xl md:text-4xl font-normal mb-0 text-foreground">
            <span className="text-[#dbe0e1]">
              <span className="text-secondary pr-2 text-5xl md:text-7xl">
                <span className="mutant-outline">93%</span>
              </span>
              “would take part again”.
            </span>
          </h3>
          <p className="text-lg italic font-medium md:text-normal mb-16 text-gray-600 mt-12">
            Source: 2024 Post season survey
          </p>
        </div>
      </section>
      {/* Season 2 */}
      <section className="py-44 px-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-3xl font-normal mb-0 text-center text-foreground">
            <span className="text-primary">Season 2</span>
          </h1>
          <p className="text-lg font-medium md:text-normal mb-16 text-center">
            Registration is open.
          </p>

          {/* Season 2 Slides */}
          <div className="mb-16">
            <SlidesCarousel
              slides={[
                "NCHC-Season-2-slides-1.jpeg",
                "NCHC-Season-2-slides-2.jpeg",
                "NCHC-Season-2-slides-3.jpeg",
                "NCHC-Season-2-slides-4.jpeg",
                "NCHC-Season-2-slides-5.jpeg",
                "NCHC-Season-2-slides-6.jpeg",
                "NCHC-Season-2-slides-7.jpeg",
                "NCHC-Season-2-slides-8.jpeg",
                "NCHC-Season-2-slides-9.jpeg",
                "NCHC-Season-2-slides-10.jpeg",
                "NCHC-Season-2-slides-11.jpeg",
                "NCHC-Season-2-slides-12.jpeg",
                "NCHC-Season-2-slides-13.jpeg",
                "NCHC-Season-2-slides-14.jpeg",
                "NCHC-Season-2-slides-15.jpeg",
                "NCHC-Season-2-slides-16.jpeg",
                "NCHC-Season-2-slides-17.jpeg",
                "NCHC-Season-2-slides-18.jpeg",
                "NCHC-Season-2-slides-19.jpeg",
                "NCHC-Season-2-slides-20.jpeg",
              ]}
              title="NCHC Season 2 Details"
            />
          </div>
        </div>
      </section>

      {/* Commissioner Message */}
      <section className="py-36 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="lg:text-8xl md:text-6xl text-4xl tracking-tight text-foreground">
              The NCHC Difference
            </h1>
            <p className="text-xl text-gray-600">
              From our League Commissioner
            </p>
          </div>

          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-black rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Organization & Commitment
                  </h3>
                  <p className="text-gray-700">
                    We value organization and commitment to our participating
                    teams and their families. What sets us apart is our promise
                    to give teams and families an excellent experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-black rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    We make it feel Pro.
                  </h3>
                  <p className="text-gray-700">
                    High-quality courts, seating, and facilities enhance the
                    experience for players, coaches, and spectators while
                    reflecting our commitment to excellence.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-black rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Exposure & Recognition
                  </h3>
                  <p className="text-gray-700">
                    Games are live streamed and advanced stats are kept, both
                    provide members with exposure and recognition. We pay very
                    close attention to the details to people who are serious
                    about good hoops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-44 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">NCHC President & Founder</h2>
          <div className="mb-20">
            <p className="text-2xl grotesk mb-4 text-secondary">
              Andrew DiMillo
            </p>
          </div>
          <blockquote className="text-xl italic text-gray-300 max-w-xl mx-auto leading-relaxed">
            "When the final NCHC buzzer sounds, one program will be crowned in
            the heart of our great nation. Champions will rise in the Capital."
          </blockquote>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-44 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Rise?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the transformation. Be part of Canada's basketball evolution in
            the Nation's Capital.
          </p>
          <a
            href="/register"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary/80 transition-colors"
          >
            Register Your Team
          </a>
        </div>
      </section>
    </div>
  );
}
