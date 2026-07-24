import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";
import { HSE_GUIDES } from "../src/content/hse-guides";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@atm-hse-academy.com" },
    update: {},
    create: {
      name: "Admin ATM",
      email: "admin@atm-hse-academy.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const formateurPassword = await bcrypt.hash("Formateur123!", 12);
  const formateur = await prisma.user.upsert({
    where: { email: "formateur@atm-hse-academy.com" },
    update: {
      formateurApproved: true,
      bio: "Ingénieure HSE certifiée, 12 ans d'expérience en prévention des risques industriels dans les secteurs minier et pétrolier en Afrique de l'Ouest.",
    },
    create: {
      name: "Fatou Diallo",
      email: "formateur@atm-hse-academy.com",
      passwordHash: formateurPassword,
      role: "FORMATEUR",
      formateurApproved: true,
      bio: "Ingénieure HSE certifiée, 12 ans d'expérience en prévention des risques industriels dans les secteurs minier et pétrolier en Afrique de l'Ouest.",
    },
  });

  const etudiantPassword = await bcrypt.hash("Etudiant123!", 12);
  await prisma.user.upsert({
    where: { email: "etudiant@atm-hse-academy.com" },
    update: {},
    create: {
      name: "Koffi Yao",
      email: "etudiant@atm-hse-academy.com",
      passwordHash: etudiantPassword,
      role: "ETUDIANT",
    },
  });

  const securite = await prisma.category.upsert({
    where: { slug: "securite-generale" },
    update: {},
    create: { name: "Sécurité générale", slug: "securite-generale" },
  });

  const guidesHse = await prisma.category.upsert({
    where: { slug: "guides-hse" },
    update: {},
    create: { name: "Guides HSE", slug: "guides-hse" },
  });

  const environnement = await prisma.category.upsert({
    where: { slug: "environnement" },
    update: {},
    create: { name: "Environnement", slug: "environnement" },
  });

  const course1 = await prisma.course.upsert({
    where: { slug: "introduction-a-la-securite-au-travail" },
    update: {},
    create: {
      title: "Introduction à la sécurité au travail",
      slug: "introduction-a-la-securite-au-travail",
      description:
        "Les fondamentaux de la Santé, Sécurité et Environnement pour tout professionnel travaillant sur un site industriel.",
      level: "DEBUTANT",
      published: true,
      formateurId: formateur.id,
      categoryId: securite.id,
      modules: {
        create: [
          {
            title: "Les bases de la culture sécurité",
            order: 1,
            lessons: {
              create: [
                {
                  title: "Pourquoi la sécurité au travail est essentielle",
                  order: 1,
                  type: "TEXTE",
                  duration: 10,
                  content:
                    "La sécurité au travail protège la vie des employés et la continuité des opérations.\n\nElle repose sur la prévention, la formation continue et l'engagement de tous les niveaux hiérarchiques.",
                },
                {
                  title: "Les acteurs de la prévention",
                  order: 2,
                  type: "TEXTE",
                  duration: 8,
                  content:
                    "Chaque acteur, du dirigeant à l'opérateur, a un rôle à jouer dans la prévention des risques professionnels.",
                },
              ],
            },
          },
        ],
      },
      quizzes: {
        create: [
          {
            title: "Quiz : Introduction à la sécurité",
            passingScore: 70,
            questions: {
              create: [
                {
                  text: "Quel est l'objectif principal de la culture sécurité ?",
                  order: 1,
                  choices: {
                    create: [
                      { text: "Réduire les coûts uniquement", isCorrect: false },
                      { text: "Protéger la vie des travailleurs", isCorrect: true },
                      { text: "Respecter uniquement la loi", isCorrect: false },
                    ],
                  },
                },
                {
                  text: "Qui est responsable de la sécurité sur un site ?",
                  order: 2,
                  choices: {
                    create: [
                      { text: "Uniquement le responsable HSE", isCorrect: false },
                      { text: "Tous les acteurs de l'entreprise", isCorrect: true },
                      { text: "Uniquement la direction", isCorrect: false },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.course.upsert({
    where: { slug: "gestion-des-dechets-industriels" },
    update: { price: 100000 },
    create: {
      title: "Gestion des déchets industriels",
      slug: "gestion-des-dechets-industriels",
      description:
        "Maîtrisez les bonnes pratiques de tri, traitement et valorisation des déchets en milieu industriel, conformément à la norme ISO 14001.",
      level: "INTERMEDIAIRE",
      published: true,
      price: 100000,
      formateurId: formateur.id,
      categoryId: environnement.id,
      modules: {
        create: [
          {
            title: "Cadre réglementaire et normes",
            order: 1,
            lessons: {
              create: [
                {
                  title: "La norme ISO 14001",
                  order: 1,
                  type: "TEXTE",
                  duration: 12,
                  content:
                    "ISO 14001 définit les exigences pour un système de management environnemental efficace.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "5-reflexes-securite-sur-chantier" },
    update: {},
    create: {
      title: "5 réflexes sécurité à adopter sur un chantier",
      slug: "5-reflexes-securite-sur-chantier",
      excerpt:
        "Découvrez les cinq réflexes essentiels que tout professionnel du BTP devrait adopter au quotidien.",
      content:
        "La sécurité sur un chantier commence par des gestes simples mais essentiels.\n\n1. Porter systématiquement ses EPI.\n2. Vérifier son environnement de travail avant de commencer.\n3. Signaler immédiatement toute situation dangereuse.\n4. Respecter les procédures de verrouillage/étiquetage.\n5. Participer activement aux Toolbox Meetings.\n\nCes réflexes, une fois ancrés dans la culture d'équipe, réduisent considérablement le risque d'accident.",
      published: true,
      authorId: admin.id,
      categoryId: securite.id,
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "comprendre-le-taux-de-frequence" },
    update: {},
    create: {
      title: "Comprendre le taux de fréquence des accidents",
      slug: "comprendre-le-taux-de-frequence",
      excerpt:
        "Un indicateur clé pour piloter la performance sécurité de votre entreprise.",
      content:
        "Le taux de fréquence mesure le nombre d'accidents avec arrêt de travail par million d'heures travaillées.\n\nIl permet de comparer la performance sécurité entre sites, équipes ou périodes, et d'orienter les actions de prévention.",
      published: true,
      authorId: formateur.id,
      categoryId: securite.id,
    },
  });

  // Bibliothèque de guides HSE de référence (articles longs, catégorie Guides HSE).
  // Idempotent : on met à jour le contenu à chaque seed pour refléter les révisions.
  for (const guide of HSE_GUIDES) {
    await prisma.blogPost.upsert({
      where: { slug: guide.slug },
      update: {
        title: guide.title,
        excerpt: guide.excerpt,
        content: guide.content,
      },
      create: {
        title: guide.title,
        slug: guide.slug,
        excerpt: guide.excerpt,
        content: guide.content,
        published: true,
        authorId: formateur.id,
        categoryId: guidesHse.id,
      },
    });
  }

  const LEAD_MAGNET = "/ressources/checklist-securite-chantier-atm-hse.pdf";
  const documents = [
    {
      title: "Check-list d'inspection sécurité chantier",
      description:
        "10 points essentiels à vérifier avant de démarrer des travaux sur un chantier.",
      category: "CHECKLIST" as const,
      fileUrl: LEAD_MAGNET,
    },
    {
      title: "Modèle de Toolbox Meeting",
      description:
        "Trame prête à l'emploi pour animer un briefing sécurité quotidien avec vos équipes.",
      category: "TOOLBOX_MEETING" as const,
      fileUrl: LEAD_MAGNET,
    },
    {
      title: "Trame JSA / JHA (analyse de sécurité des tâches)",
      description:
        "Grille d'analyse des risques par tâche, avec identification des dangers et mesures de prévention.",
      category: "JSA_JHA" as const,
      fileUrl: LEAD_MAGNET,
    },
    {
      title: "Aperçu de la norme ISO 45001",
      description:
        "Synthèse des exigences clés du système de management de la santé et sécurité au travail.",
      category: "NORME_ISO" as const,
      fileUrl: LEAD_MAGNET,
    },
  ];

  for (const doc of documents) {
    const existing = await prisma.document.findFirst({ where: { title: doc.title } });
    if (!existing) {
      await prisma.document.create({ data: doc });
    }
  }

  console.log("Seed terminé :", {
    admin: admin.email,
    formateur: formateur.email,
    course1: course1.slug,
    documents: documents.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
