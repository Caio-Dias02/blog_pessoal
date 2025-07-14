import { createFileRoute } from '@tanstack/react-router'
import { mockAuthor } from '../services/mockData'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">


        {/* Página Sobre */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex items-center space-x-6">
              <img
                src={mockAuthor.avatar}
                alt={mockAuthor.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold mb-2">{mockAuthor.name}</h1>
                <p className="text-blue-100 text-lg">
                  {mockAuthor.bio}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Sobre mim */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                👋 Sobre mim
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  Olá! Eu sou um desenvolvedor Full Stack apaixonado por criar soluções inovadoras e compartilhar conhecimento com a comunidade. 
                  Trabalho principalmente com tecnologias modernas como React, Node.js, TypeScript e várias outras ferramentas do ecossistema JavaScript.
                </p>
                <p className="mb-4">
                  Minha jornada na programação começou há alguns anos, e desde então venho me dedicando a aprender constantemente e 
                  aplicar as melhores práticas em desenvolvimento de software. Acredito que o conhecimento deve ser compartilhado, 
                  por isso criei este blog para documentar minha experiência e ajudar outros desenvolvedores.
                </p>
                <p>
                  Quando não estou codando, gosto de ler sobre novas tecnologias, contribuir para projetos open source e 
                  participar de comunidades de desenvolvedores. Sempre estou aberto a novos desafios e oportunidades de aprendizado!
                </p>
              </div>
            </section>

            {/* Habilidades */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                🛠️ Habilidades Técnicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Frontend</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <span>React & React Query</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <span>TypeScript</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <span>Next.js & Vite</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <span>Tailwind CSS</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Backend</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      <span>Node.js & Express</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      <span>PostgreSQL & MongoDB</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      <span>REST APIs & GraphQL</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      <span>Docker & AWS</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contato */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                📬 Vamos conversar!
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Estou sempre aberto a conversas sobre tecnologia, oportunidades de colaboração ou apenas para trocar ideias. 
                  Entre em contato comigo através dos canais abaixo:
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={`mailto:${mockAuthor.email}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📧 Email
                  </a>
                  {mockAuthor.socialLinks.github && (
                    <a 
                      href={mockAuthor.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      🐙 GitHub
                    </a>
                  )}
                  {mockAuthor.socialLinks.linkedin && (
                    <a 
                      href={mockAuthor.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      💼 LinkedIn
                    </a>
                  )}
                  {mockAuthor.socialLinks.twitter && (
                    <a 
                      href={mockAuthor.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      🐦 Twitter
                    </a>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>


      </div>
    </div>
  )
} 