import type { VideoGuide } from "./types";

const fr: VideoGuide = {
  guideHeading: "Mode d’emploi",
  guideIntro: "De la connexion à votre première vidéo en cinq minutes environ. NICS Video et NICS Studio partagent une seule connexion et un seul solde de crédits.",
  guides: [
    {
      title: "Se connecter et recevoir 10 crédits gratuits",
      steps: [
        "Touchez « Se connecter », saisissez votre e-mail et touchez « Recevoir le code ».",
        "Ouvrez l’e-mail de noreply@aibyteconsult.com (vérifiez aussi les spams) et saisissez le code à 6 chiffres. Il est valable 15 minutes.",
        "Vous restez connecté sur cet appareil, sur NICS Video et dans NICS Studio.",
        "Dans « Tarifs », touchez « Obtenir 10 crédits », indiquez votre nom et confirmez. Aucune carte requise ; les crédits sont offerts une fois par e-mail et valables 30 jours.",
      ],
    },
    {
      title: "Montage automatique avec NICS Video",
      steps: [
        "Dans « Envoyez vos images », écrivez un titre pour les couvertures (celui en anglais est facultatif).",
        "Choisissez jusqu’à 20 clips : MP4, MOV, AVI, MKV, M4V ou 3GP, jusqu’à 1 Go chacun et 1,5 Go au total.",
        "Touchez « Envoyer et lancer » et gardez la page ouverte jusqu’à la fin de l’envoi. Un pack coûte 10 crédits.",
        "Ensuite, vous pouvez fermer la page. Le statut affiche la file d’attente, l’analyse des scènes, le plan de montage, le rendu et les couvertures.",
        "Quand le pack est prêt, vous recevez un e-mail avec un lien. Téléchargez le Short, la vidéo longue et les quatre couvertures sous 7 jours.",
      ],
    },
    {
      title: "Monter soi-même dans NICS Studio",
      steps: [
        "Ouvrez NICS Studio et ajoutez des vidéos ou des photos dans « Médias ». La vidéo finale peut durer jusqu’à 3 minutes.",
        "Montez sur la timeline : couper, scinder, réordonner, ajouter texte, musique, filtres, zooms et fondus. Les retouches manuelles sont gratuites.",
        "Ou écrivez à l’agent en anglais ou en russe, par exemple : « cut the pauses, add captions 3 words at a time, a little bigger, and add zooms ». Une demande coûte 1 crédit.",
        "Sous-titres : ouvrez « Sous-titres », choisissez le russe ou l’anglais et touchez « Générer les sous-titres » (1 crédit). Vérifiez et corrigez le texte.",
        "Choisissez 9:16, 16:9 ou 1:1 et touchez « Exporter » (2 crédits), puis « Télécharger ». Les projets s’enregistrent automatiquement dans ce navigateur.",
      ],
    },
    {
      title: "Acheter une formule",
      steps: [
        "Quand les crédits s’épuisent, le site indique combien il en faut et combien il en reste.",
        "Dans « Tarifs », choisissez Start, Creator ou Pro et touchez « Continuer vers le paiement ». Utilisez le même e-mail que pour la connexion.",
        "Payez par carte sur la page sécurisée Revolut qui s’ouvre dans un nouvel onglet. Le paiement est en euros.",
        "Quelques minutes après le paiement, les crédits s’activent d’eux-mêmes pour 30 jours. Continuez vos envois ou NICS Studio.",
      ],
    },
  ],
  faqHeading: "Questions fréquentes",
  faq: [
    {
      q: "Comment fonctionne NICS Video ?",
      a: "Envoyez vos clips : le système choisit les meilleurs plans et monte pour vous un Short, une vidéo longue et des couvertures. Pour monter à la main, ouvrez NICS Studio, dites à l’agent quoi changer, peaufinez la timeline et exportez quand vous êtes prêt.",
    },
    {
      q: "Quelles vidéos puis-je utiliser ?",
      a: "Pour le montage automatique : MP4, MOV, AVI, MKV, M4V ou 3GP, jusqu’à 20 fichiers, 1 Go chacun et 1,5 Go au total. NICS Studio accepte les vidéos MP4 ou MOV et les photos JPG ou PNG, pour une vidéo finale de 3 minutes maximum.",
    },
    {
      q: "Puis-je modifier mes vidéos ?",
      a: "Oui, dans NICS Studio : couper et réordonner les clips, ajouter sous-titres, texte, musique, filtres, zooms et fondus, passer en 9:16, 16:9 ou 1:1. Les retouches manuelles sont gratuites ; les crédits servent seulement à l’agent, aux sous-titres et à l’export.",
    },
    {
      q: "Quelles langues sont prises en charge ?",
      a: "Les couvertures existent en russe et en anglais. Les sous-titres et les commandes de l’agent fonctionnent en russe et en anglais. Le site et l’éditeur sont disponibles en 12 langues, d’autres langues arrivent.",
    },
    {
      q: "Comment fonctionnent les crédits ?",
      a: "Un seul solde pour les deux services : un pack automatique coûte 10 crédits, un export dans NICS Studio 2, une demande à l’agent 1, les sous-titres 1. Les crédits ne sont débités qu’après un travail réussi et restent valables 30 jours.",
    },
    {
      q: "Puis-je résilier ma formule ?",
      a: "Il n’y a rien à résilier : chaque paiement est un achat unique de crédits pour 30 jours, sans renouvellement automatique ni prélèvement récurrent. Pour continuer, achetez une nouvelle formule.",
    },
    {
      q: "Combien coûte NICS Video ?",
      a: "Vous commencez gratuitement avec 10 crédits, une fois. Ensuite Start 14,99 EUR (60 crédits), Creator 34,99 EUR (250) ou Pro 69,99 EUR (700), chacun pour 30 jours. Paiement par carte via Revolut.",
    },
    {
      q: "Qu’est-ce qu’un crédit ?",
      a: "Le crédit sert à payer le travail de l’IA : montage automatique, reconnaissance vocale pour les sous-titres, demandes à l’agent et rendu de la vidéo finale. Avec la formule Start, un crédit coûte environ 25 centimes.",
    },
    {
      q: "Où sont conservés mes fichiers ?",
      a: "Le montage automatique tourne sur notre propre matériel avec des modèles locaux, jamais sur des clouds d’IA externes ; les fichiers finis sont conservés 7 jours. NICS Studio fonctionne sur votre appareil et n’envoie vos fichiers nulle part.",
    },
    {
      q: "Je n’ai pas reçu le code de connexion",
      a: "Vérifiez les spams et touchez « Renvoyer ». Un même e-mail peut recevoir 5 codes par heure au maximum. Toujours bloqué ? Écrivez à info@aibyteconsult.com.",
    },
  ],
};

export default fr;
