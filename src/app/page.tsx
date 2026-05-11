const projects = [
  {
    title: "Project Alpha",
    description:
      "A full-stack web application built with Next.js and TypeScript.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Project Beta",
    description: "REST API service with authentication and rate limiting.",
    tags: ["Node.js", "Express", "PostgreSQL"],
  },
  {
    title: "Project Gamma",
    description: "Real-time dashboard for monitoring application metrics.",
    tags: ["React", "WebSockets", "D3.js"],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col gap-16 py-24 px-8 bg-white dark:bg-black">
        <section className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            Jane Developer
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Full-stack engineer passionate about building beautiful, performant
            web applications. Currently focused on React, TypeScript, and
            cloud-native architectures.
          </p>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Projects
          </h2>
          <div className="grid gap-6">
            {projects.map((project) => (
              <div
                key={project.title}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
              >
                <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                  {project.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Contact
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Reach out via{" "}
            <a
              href="mailto:jane@example.com"
              className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
            >
              email
            </a>{" "}
            or connect on{" "}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
            >
              GitHub
            </a>
            .
          </p>
        </section>
      </main>
    </div>
  );
}
