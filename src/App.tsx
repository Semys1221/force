/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Wolf.OS — Straight Line Engine v5.0
 * Corrections Jordan Belfort appliquées :
 * - Ton B1 adouci
 * - Pont émotionnel avant pitch
 * - Loops de closing naturalisées (sans jauge explicite)
 * - Sortie mandat 48h (LOOP_EXIT) remplace disqualification
 * - Disqualification supprimée du closing
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ShieldCheck, Activity, AlertTriangle,
  XCircle, CheckCircle2, ArrowRight, ExternalLink
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeType =
  | 'main' | 'yellow' | 'red' | 'transition' | 'info'
  | 'end' | 'purple' | 'multi-select' | 'bridge' | 'exit';

interface Option {
  label: string;
  text: string;
  next: string;
  scoreImpact: number;
  type?: 'vert' | 'jaune' | 'rouge' | 'info' | 'suivant' | 'violet';
}

interface ScriptNode {
  id: string;
  tag: string;
  type: NodeType;
  question: string;
  options: Option[];
  isStrike?: boolean;
}

// ─── Script ───────────────────────────────────────────────────────────────────

const SCRIPT: Record<string, ScriptNode> = {

  // ── BLOCK 1 : COOPÉRATION ET CADRE ─────────────────────────────────────────

  'INTRO': {
    id: 'INTRO', tag: 'BIENVENUE', type: 'info',
    question: "Bonjour (Name), c'est Evan de Montis Media ! Ravie de vous avoir.",
    options: [{ label: 'INFO', text: "Bonjour Evan.", next: 'B1_SON', scoreImpact: 0 }]
  },

  'B1_SON': {
    id: 'B1_SON', tag: 'B1 : LOGISTIQUE', type: 'info',
    question: "Le son est bon de votre côté ? On a besoin d'une clarté totale pour ce qui va suivre.",
    options: [{ label: 'INFO', text: "L'audio est parfait.", next: 'B1_POURQUOI', scoreImpact: 0 }]
  },

  'B1_POURQUOI': {
    id: 'B1_POURQUOI', tag: 'B1 : INTENTION', type: 'main',
    question: "Écoutez, j'ai vu que vous aviez réservé ce créneau pour passer à 20 audits à forte TMI par mois. Pour qu'on soit efficace et ne pas vous faire perdre de temps, je vais vous poser quelques questions rapides... l'idée est de voir si on a un 'fit' mutuel et si mon infrastructure est réellement capable de supporter votre croissance actuelle. Si c'est le cas, je vous expliquerai comment on procède, sinon, je serai le premier à vous le dire. Ça vous paraît honnête ?",
    options: [
      { label: 'VERT', text: "Absolument", next: 'B1_ACCRED', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous ne comprenez pas le fonctionnement ?", next: 'B1_POURQUOI_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous êtes simplement curieux ?", next: 'B1_POURQUOI_R1', scoreImpact: -15 },
      { label: 'VIOLET', text: "Raccourci : Accord sur le cadre", next: 'B1_PURPLE', scoreImpact: 20 }
    ]
  },

  'B1_PURPLE': {
    id: 'B1_PURPLE', tag: 'B1 : RÉCAPITULATIF', type: 'purple',
    question: "Vous admettez donc que pour scaler, on doit bosser en transparence totale et que je suis le seul à pouvoir auditer votre structure pour garantir le fit ?",
    options: [
      { label: 'VERT', text: "C'est exactement ça, passons à la suite.", next: 'B2_POURQUOI_PAS', scoreImpact: 10 },
      { label: 'ROUGE', text: "Non, revenons en arrière.", next: 'B1_POURQUOI', scoreImpact: -10 }
    ]
  },

  'B1_POURQUOI_Y1': {
    id: 'B1_POURQUOI_Y1', tag: 'B1 : AUTORITÉ', type: 'yellow',
    question: "Je comprends. Mais j'investis mon propre budget sur mes partenaires. Avant de vous prouver quoi que ce soit, je dois m'assurer que votre structure peut absorber mes flux. On est d'accord sur le principe ?",
    options: [
      { label: 'VERT', text: "L'audit est logique ?", next: 'B1_ACCRED', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous restez sur la réserve ?", next: 'YELLOW_2', scoreImpact: -10 }
    ]
  },

  'B1_POURQUOI_R1': {
    id: 'B1_POURQUOI_R1', tag: 'B1 : RÉALITÉ', type: 'red',
    question: "La curiosité ne remplit pas le frigo. On est là pour le business.",
    options: [
      { label: 'VERT', text: "On attaque les vrais sujets ?", next: 'B1_ACCRED', scoreImpact: 10 },
      { label: 'ROUGE', text: "Vous persistez ?", next: 'B1_POURQUOI_R2', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B1_POURQUOI_Y1', scoreImpact: -10 }
    ]
  },

  'B1_POURQUOI_R2': {
    id: 'B1_POURQUOI_R2', tag: 'B1 : AMBITION', type: 'red',
    question: "Le site web est pour les curieux, le RDV est pour les ambitieux. On n'est pas là pour se faire perdre du temps mutuellement, on est d'accord ?",
    options: [
      { label: 'VERT', text: "On avance ?", next: 'B1_ACCRED', scoreImpact: 10 },
      { label: 'ROUGE', text: "Vous bloquez ?", next: 'B1_POURQUOI_R3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B1_POURQUOI_Y1', scoreImpact: -10 }
    ]
  },

  // ── CORRECTION BELFORT : ton adouci, miroir au lieu d'humiliation ──
  'B1_POURQUOI_R3': {
    id: 'B1_POURQUOI_R3', tag: 'B1 : CONFRONTATION', type: 'red',
    question: "Je vais être direct avec vous. Ce créneau, vous l'avez réservé vous-même. Ça veut dire qu'il y a une raison. On la trouve ensemble ou on s'arrête là — mais on ne fait pas semblant.",
    options: [
      { label: 'VERT', text: "On parle sérieusement", next: 'B1_ACCRED', scoreImpact: 20 },
      { label: 'ROUGE', text: "On en reste là", next: 'DISQUALIFY', scoreImpact: -50 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B1_POURQUOI_Y1', scoreImpact: -10 }
    ]
  },

  'B1_ACCRED': {
    id: 'B1_ACCRED', tag: 'B1 : LÉGALITÉS', type: 'info',
    question: "Avant d'entrer dans le vif, je valide la structure : vous êtes bien à jour sur vos accréditations SIF, IOBSP et Carte T ?",
    options: [{ label: 'INFO', text: "Tout est en règle.", next: 'B1_VISIO', scoreImpact: 0 }]
  },

  'B1_VISIO': {
    id: 'B1_VISIO', tag: 'B1 : GÉOGRAPHIE', type: 'info',
    question: "Vous opérez uniquement en local ou vous fermez déjà des dossiers en visio à l'échelle nationale ?",
    options: [{ label: 'INFO', text: "La visio est maîtrisée.", next: 'B1_CADRE', scoreImpact: 0 }]
  },

  'B1_CADRE': {
    id: 'B1_CADRE', tag: 'B1 : LE CADRE', type: 'main',
    question: "Je fonctionne à la performance et j'investis mon propre budget sur mes partenaires. Pour que cela fonctionne, j'ai besoin d'une transparence totale. On est d'accord sur le principe ?",
    options: [
      { label: 'VERT', text: "L'approche vous semble saine ?", next: 'T1', scoreImpact: 10 },
      { label: 'JAUNE', text: "Le cadre vous dérange ?", next: 'B1_CADRE_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous hésitez à coopérer ?", next: 'B1_CADRE_R1', scoreImpact: -15 }
    ]
  },

  'B1_CADRE_Y1': {
    id: 'B1_CADRE_Y1', tag: 'B1 : STORY', type: 'yellow',
    question: "Au début, je prenais tout le monde. Résultat : crash. Leurs cabinets n'avaient pas l'Indice d'Absorption requis. Je refuse de répéter cette erreur. On valide votre châssis ?",
    options: [
      { label: 'VERT', text: "Mon expérience fait sens ?", next: 'T1', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous refusez l'audit ?", next: 'YELLOW_3', scoreImpact: -10 }
    ]
  },

  'B1_CADRE_R1': {
    id: 'B1_CADRE_R1', tag: 'B1 : PARADOXE', type: 'red',
    question: "Si vous hésitez sur la transparence, c'est que vous n'êtes pas prêt pour un moteur industriel. Le temps d'un CGP vaut cher, le mien aussi. On joue carte sur table ?",
    options: [
      { label: 'VERT', text: "On parle chiffres ?", next: 'T1', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous restez sur la défensive ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B1_CADRE_Y1', scoreImpact: -10 }
    ]
  },

  'T1': {
    id: 'T1', tag: 'TRANSITION 1', type: 'transition',
    question: "Parfait. Puisque le cadre est posé, entrons dans la mécanique. Pour que mon investissement soit rentable, je dois localiser précisément où se situe la friction dans votre rentabilité actuelle.",
    options: [{ label: 'SUIVANT', text: "Analyser la rentabilité", next: 'B2_POURQUOI_PAS', scoreImpact: 0 }]
  },

  // ── BLOCK 2 : DOULEUR ET DIAGNOSTIC ────────────────────────────────────────

  'B2_POURQUOI_PAS': {
    id: 'B2_POURQUOI_PAS', tag: 'B2 : LE PLAFOND', type: 'main',
    question: "Pourquoi maintenant ? Pourquoi ne pas simplement continuer avec votre stratégie actuelle et doubler vos efforts ?",
    options: [
      { label: 'VERT', text: "La recommandation a ses limites ?", next: 'B2_SPE', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous défendez votre modèle ?", next: 'B2_POURQUOI_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous esquivez le blocage ?", next: 'B2_POURQUOI_R1', scoreImpact: -15 },
      { label: 'VIOLET', text: "Raccourci : Accord sur le diagnostic", next: 'B2_PURPLE', scoreImpact: 20 }
    ]
  },

  'B2_PURPLE': {
    id: 'B2_PURPLE', tag: 'B2 : RÉCAPITULATIF', type: 'purple',
    question: "Vous reconnaissez que votre modèle actuel a atteint son plafond, que vous perdez de l'argent sur chaque petit ticket et que l'hémorragie doit s'arrêter maintenant ?",
    options: [
      { label: 'VERT', text: "C'est exactement ça, passons à la suite.", next: 'B3_START', scoreImpact: 10 },
      { label: 'ROUGE', text: "Non, revenons en arrière.", next: 'B2_POURQUOI_PAS', scoreImpact: -10 }
    ]
  },

  'B2_POURQUOI_Y1': {
    id: 'B2_POURQUOI_Y1', tag: 'B2 : MÉTIER', type: 'yellow',
    question: "Vous êtes CGP. Vous ne faites jamais de préconisation sans audit patrimonial. Pourquoi accepterais-je de vous greffer mon système sans auditer votre acquisition actuelle ?",
    options: [
      { label: 'VERT', text: "On travaille de la même façon ?", next: 'B2_SPE', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous refusez l'audit ?", next: 'YELLOW_3', scoreImpact: -10 }
    ]
  },

  'B2_POURQUOI_R1': {
    id: 'B2_POURQUOI_R1', tag: 'B2 : ULTIMATUM', type: 'red',
    question: "Si votre stratégie actuelle suffisait, on ne serait pas en ligne. On identifie le plafond de verre ?",
    options: [
      { label: 'VERT', text: "On identifie le blocage ?", next: 'B2_SPE', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous restez fermé ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B2_POURQUOI_Y1', scoreImpact: -10 }
    ]
  },

  'B2_SPE': {
    id: 'B2_SPE', tag: 'B2 : POSITIONNEMENT', type: 'info',
    question: "Votre spécialité, c'est la valorisation de capital pur ou vous touchez déjà à l'ingénierie complexe (Holding, BNC, BIC) ?",
    options: [{ label: 'INFO', text: "Le pivot vers le complexe est visé.", next: 'B2_TICKET', scoreImpact: 0 }]
  },

  'B2_TICKET': {
    id: 'B2_TICKET', tag: "B2 : L'HÉMORRAGIE", type: 'main',
    question: "Vous faites 4 deals par mois, mais quel est le ticket moyen ? Si vous passez 2h pour un dossier à 4 000 €, vous brûlez votre temps. On est d'accord que c'est là que ça fuit ?",
    options: [
      { label: 'VERT', text: "Vous perdez trop de temps ?", next: 'B2_DUREE', scoreImpact: 15 },
      { label: 'JAUNE', text: "Vous refusez le constat ?", next: 'B2_TICKET_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous minimisez la perte ?", next: 'B2_TICKET_R1', scoreImpact: -15 }
    ]
  },

  'B2_TICKET_Y1': {
    id: 'B2_TICKET_Y1', tag: 'B2 : PERFORMANCE', type: 'yellow',
    question: "Chaque heure passée sur un petit ticket est une heure volée à un dossier à 50k. C'est une question de mathématiques, pas d'opinion. On valide les chiffres ?",
    options: [
      { label: 'VERT', text: "C'est mathématique ?", next: 'B2_DUREE', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous contestez les maths ?", next: 'YELLOW_2', scoreImpact: -10 }
    ]
  },

  'B2_TICKET_R1': {
    id: 'B2_TICKET_R1', tag: 'B2 : RÉALITÉ', type: 'red',
    question: "Minimiser la perte est le meilleur moyen de rester petit. Un moteur industriel ne tourne pas sur des miettes. On parle de vraie croissance ou de survie ?",
    options: [
      { label: 'VERT', text: "On parle de croissance ?", next: 'B2_DUREE', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous restez sur la survie ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B2_TICKET_Y1', scoreImpact: -10 }
    ]
  },

  'B2_DUREE': {
    id: 'B2_DUREE', tag: "B2 : L'URGENCE", type: 'info',
    question: "Depuis combien de temps ce blocage persiste ? Comment cela impacte-t-il votre croissance réelle ?",
    options: [{ label: 'INFO', text: "Le CA plafonne depuis 6 mois.", next: 'T2', scoreImpact: 0 }]
  },

  'T2': {
    id: 'T2', tag: 'TRANSITION 2', type: 'transition',
    question: "On a localisé l'hémorragie. Maintenant, un entrepreneur comme vous n'est pas resté les bras croisés. Voyons ce que vous avez déjà tenté pour stopper l'hémorragie.",
    options: [{ label: 'SUIVANT', text: "Explorer les alternatives", next: 'B3_START', scoreImpact: 0 }]
  },

  // ── BLOCK 3 : ALTERNATIVES ──────────────────────────────────────────────────

  'B3_START': {
    id: 'B3_START', tag: 'B3 : SOLUTIONS', type: 'multi-select',
    question: "Quelles méthodes d'acquisition utilisez-vous ou avez-vous envisagées ? (Sélectionnez tout ce qui s'applique)",
    options: [
      { label: 'INFO', text: "Prospection LinkedIn (Appréciée)", next: 'LI_LIKE', scoreImpact: 0 },
      { label: 'INFO', text: "Prospection LinkedIn (Rejetée)", next: 'LI_DISLIKE', scoreImpact: 0 },
      { label: 'INFO', text: "Fiches de leads (Testées)", next: 'LEADS_TESTED', scoreImpact: 0 },
      { label: 'INFO', text: "Fiches de leads (Envisagées)", next: 'LEADS_ENVISAGED', scoreImpact: 0 },
      { label: 'INFO', text: "Apport d'affaires", next: 'APPORT', scoreImpact: 0 },
      { label: 'INFO', text: "Partenariats institutionnels", next: 'PARTENARIAT', scoreImpact: 0 },
      { label: 'INFO', text: "Recommandation", next: 'RECO', scoreImpact: 0 },
      { label: 'SUIVANT', text: "Démarrer l'analyse", next: 'B3_PROCESS', scoreImpact: 0 }
    ]
  },

  'B3_PURPLE': {
    id: 'B3_PURPLE', tag: 'B3 : RÉCAPITULATIF', type: 'purple',
    question: "On est d'accord : vos méthodes actuelles ont atteint leur plafond et ne vous permettront pas d'atteindre vos objectifs ?",
    options: [
      { label: 'VERT', text: "C'est exactement ça, passons à la suite.", next: 'B4_FLUX', scoreImpact: 10 },
      { label: 'ROUGE', text: "Non, revenons en arrière.", next: 'B3_START', scoreImpact: -10 }
    ]
  },

  'T3': {
    id: 'T3', tag: 'TRANSITION 3', type: 'transition',
    question: "On a enterré les méthodes inefficaces. Maintenant, oublions les échecs passés. Parlons de la vision long terme que vous essayez de bâtir.",
    options: [{ label: 'SUIVANT', text: "Définir la vision", next: 'B4_FLUX', scoreImpact: 0 }]
  },

  // ── BLOCK 4 : DÉSIR ET OBJECTIFS ────────────────────────────────────────────

  'B4_FLUX': {
    id: 'B4_FLUX', tag: 'B4 : FLUX IDÉAL', type: 'main',
    question: "Quel serait votre flux de transactions mensuel idéal ? On parle de combien de dossiers signés par mois ?",
    options: [
      { label: 'VERT', text: "5 dossiers complexes par mois ?", next: 'B4_REVENUS', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous contestez la pertinence ?", next: 'YELLOW_1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous esquivez la projection ?", next: 'RED_1', scoreImpact: -15 },
      { label: 'VIOLET', text: "Raccourci : Accord sur la vision", next: 'B4_PURPLE', scoreImpact: 20 }
    ]
  },

  'B4_PURPLE': {
    id: 'B4_PURPLE', tag: 'B4 : RÉCAPITULATIF', type: 'purple',
    question: "Votre vision est claire : vous visez un flux industriel pour sécuriser votre héritage familial et doubler vos revenus nets ?",
    options: [
      { label: 'VERT', text: "C'est exactement ça, passons à la suite.", next: 'B5_PROCHE', scoreImpact: 10 },
      { label: 'ROUGE', text: "Non, revenons en arrière.", next: 'B4_FLUX', scoreImpact: -10 }
    ]
  },

  'B4_REVENUS': {
    id: 'B4_REVENUS', tag: 'B4 : IMPACT FINANCIER', type: 'main',
    question: "Concrètement, combien de revenus personnels supplémentaires cela vous apporterait-il chaque mois ?",
    options: [
      { label: 'VERT', text: "Un doublement du revenu net ?", next: 'B4_PERSONNEL', scoreImpact: 10 },
      { label: 'JAUNE', text: "L'argent n'est pas le sujet ?", next: 'B4_REVENUS_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous restez évasif ?", next: 'B4_REVENUS_R1', scoreImpact: -15 }
    ]
  },

  'B4_REVENUS_Y1': {
    id: 'B4_REVENUS_Y1', tag: 'B4 : STORY', type: 'yellow',
    question: "L'argent est le carburant de votre liberté. Si ce n'est pas le sujet, c'est que vous n'avez pas encore mesuré l'impact d'un moteur industriel sur votre vie. On parle de chiffres réels ?",
    options: [
      { label: 'VERT', text: "On parle de chiffres ?", next: 'B4_PERSONNEL', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous refusez ?", next: 'YELLOW_3', scoreImpact: -10 }
    ]
  },

  'B4_REVENUS_R1': {
    id: 'B4_REVENUS_R1', tag: 'B4 : PARADOXE', type: 'red',
    question: "Rester évasif sur ses revenus, c'est avoir peur de sa propre ambition. Un partenaire d'élite assume ses besoins financiers. On joue franc jeu sur l'impact ?",
    options: [
      { label: 'VERT', text: "On joue franc jeu ?", next: 'B4_PERSONNEL', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous restez évasif ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B4_REVENUS_Y1', scoreImpact: -10 }
    ]
  },

  'B4_PERSONNEL': {
    id: 'B4_PERSONNEL', tag: 'B4 : IMPACT PERSONNEL', type: 'main',
    question: "Qu'est-ce que cet argent vous permettrait de faire sur un plan personnel (famille, retraite, hypothèque) ?",
    options: [
      { label: 'VERT', text: "Mettre la famille à l'abri ?", next: 'B4_HERITAGE', scoreImpact: 10 },
      { label: 'JAUNE', text: "C'est trop personnel ?", next: 'B4_PERSONNEL_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous n'avez pas de but ?", next: 'B4_PERSONNEL_R1', scoreImpact: -15 }
    ]
  },

  'B4_PERSONNEL_Y1': {
    id: 'B4_PERSONNEL_Y1', tag: 'B4 : AUTORITÉ', type: 'yellow',
    question: "Je ne suis pas là pour votre vie privée, mais pour comprendre ce qui vous fait courir. Si je ne connais pas votre 'Pourquoi', je ne peux pas garantir votre engagement. On partage l'essentiel ?",
    options: [
      { label: 'VERT', text: "On partage ?", next: 'B4_HERITAGE', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous bloquez ?", next: 'YELLOW_2', scoreImpact: -10 }
    ]
  },

  'B4_PERSONNEL_R1': {
    id: 'B4_PERSONNEL_R1', tag: 'B4 : RÉALITÉ', type: 'red',
    question: "Un homme sans but est un homme qui s'arrête au premier obstacle. Je cherche des partenaires qui ont une raison viscérale de réussir. Quelle est la vôtre ?",
    options: [
      { label: 'VERT', text: "J'ai une raison ?", next: 'B4_HERITAGE', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous n'en avez pas ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B4_PERSONNEL_Y1', scoreImpact: -10 }
    ]
  },

  'B4_HERITAGE': {
    id: 'B4_HERITAGE', tag: 'B4 : VISION HÉRITAGE', type: 'main',
    question: "À quoi ressemble le succès ultime, votre entreprise 'héritage' pour votre famille ?",
    options: [
      { label: 'VERT', text: "Un cabinet autonome et transmissible ?", next: 'T4', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous ne croyez pas à l'héritage ?", next: 'B4_HERITAGE_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous vivez au jour le jour ?", next: 'B4_HERITAGE_R1', scoreImpact: -15 }
    ]
  },

  'B4_HERITAGE_Y1': {
    id: 'B4_HERITAGE_Y1', tag: 'B4 : MÉTIER', type: 'yellow',
    question: "En tant que CGP, vous vendez de l'héritage toute la journée. Pourquoi refuseriez-vous d'en bâtir un pour vous-même ? On parle de vision long terme ?",
    options: [
      { label: 'VERT', text: "On parle vision ?", next: 'T4', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous refusez ?", next: 'YELLOW_3', scoreImpact: -10 }
    ]
  },

  'B4_HERITAGE_R1': {
    id: 'B4_HERITAGE_R1', tag: 'B4 : ULTIMATUM', type: 'red',
    question: "Vivre au jour le jour est un luxe que vous ne pouvez plus vous permettre si vous voulez scaler. On bâtit quelque chose de solide ?",
    options: [
      { label: 'VERT', text: "On bâtit du solide ?", next: 'T4', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous restez dans l'éphémère ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B4_HERITAGE_Y1', scoreImpact: -10 }
    ]
  },

  'T4': {
    id: 'T4', tag: 'TRANSITION 4', type: 'transition',
    question: "C'est un projet ambitieux. Mais entre cette vision et votre réalité actuelle, il y a un fossé opérationnel qu'on doit mesurer froidement.",
    options: [{ label: 'SUIVANT', text: "Mesurer le fossé", next: 'B5_PROCHE', scoreImpact: 0 }]
  },

  // ── BLOCK 5 : RÉALITÉ ET CONSÉQUENCES ──────────────────────────────────────

  'B5_PROCHE': {
    id: 'B5_PROCHE', tag: 'B5 : DISTANCE', type: 'main',
    question: "À quel point vous sentez-vous proche de cet objectif avec votre méthode actuelle ?",
    options: [
      { label: 'VERT', text: "Encore trop dans la survie ?", next: 'B5_CRM', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous pensez y être presque ?", next: 'B5_PROCHE_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous ne voulez pas voir la réalité ?", next: 'B5_PROCHE_R1', scoreImpact: -15 },
      { label: 'VIOLET', text: "Raccourci : Accord sur les conséquences", next: 'B5_PURPLE', scoreImpact: 20 }
    ]
  },

  'B5_PURPLE': {
    id: 'B5_PURPLE', tag: 'B5 : RÉCAPITULATIF', type: 'purple',
    question: "Vous voyez le fossé : sans CRM, sans gestion des no-shows et sans automatisation, votre ambition restera un rêve. On règle ça ?",
    options: [
      { label: 'VERT', text: "C'est exactement ça, passons à la suite.", next: 'B6_GOULOT', scoreImpact: 10 },
      { label: 'ROUGE', text: "Non, revenons en arrière.", next: 'B5_PROCHE', scoreImpact: -10 }
    ]
  },

  'B5_PROCHE_Y1': {
    id: 'B5_PROCHE_Y1', tag: 'B5 : PERFORMANCE', type: 'yellow',
    question: "Si vous y étiez presque, vous ne chercheriez pas un moteur externe. Soyons honnêtes sur la distance réelle pour calibrer l'effort. On valide le fossé ?",
    options: [
      { label: 'VERT', text: "On valide le fossé ?", next: 'B5_CRM', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous persistez ?", next: 'YELLOW_2', scoreImpact: -10 }
    ]
  },

  'B5_PROCHE_R1': {
    id: 'B5_PROCHE_R1', tag: 'B5 : RÉALITÉ', type: 'red',
    question: "Refuser de voir la réalité est le premier pas vers la faillite. On regarde les chiffres en face ou on continue de rêver ?",
    options: [
      { label: 'VERT', text: "On regarde en face ?", next: 'B5_CRM', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous continuez de rêver ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B5_PROCHE_Y1', scoreImpact: -10 }
    ]
  },

  'B5_CRM': {
    id: 'B5_CRM', tag: 'B5 : OUTILS', type: 'main',
    question: "Si je vous envoie 20 dirigeants qualifiés demain, comment gérez-vous le suivi ? Vous avez un CRM ou vous faites tout à la main sur Excel ?",
    options: [
      { label: 'VERT', text: "Excel est votre point faible ?", next: 'B5_NOSHOW', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous maîtrisez votre Excel ?", next: 'B5_CRM_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous improviserez ?", next: 'B5_CRM_R1', scoreImpact: -15 }
    ]
  },

  'B5_CRM_Y1': {
    id: 'B5_CRM_Y1', tag: 'B5 : STORY', type: 'yellow',
    question: "J'ai vu des génies du métier s'effondrer sous le poids de 20 leads parce qu'ils croyaient en leur Excel. Un moteur industriel exige un châssis numérique. On modernise ?",
    options: [
      { label: 'VERT', text: "On modernise ?", next: 'B5_NOSHOW', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous refusez ?", next: 'YELLOW_3', scoreImpact: -10 }
    ]
  },

  'B5_CRM_R1': {
    id: 'B5_CRM_R1', tag: 'B5 : PARADOXE', type: 'red',
    question: "L'improvisation est le cancer de la rentabilité. Si vous n'avez pas de système de suivi, vous allez brûler mon investissement. On installe un CRM ?",
    options: [
      { label: 'VERT', text: "On installe ?", next: 'B5_NOSHOW', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous improvisez ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B5_CRM_Y1', scoreImpact: -10 }
    ]
  },

  'B5_NOSHOW': {
    id: 'B5_NOSHOW', tag: 'B5 : PERTES', type: 'main',
    question: "Comment gérez-vous vos no-shows et la replanification pour ne pas avoir de trous dans la raquette ?",
    options: [
      { label: 'VERT', text: "C'est manuel et inefficace ?", next: 'B5_ECHEC', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous n'avez pas de no-shows ?", next: 'B5_NOSHOW_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous ne suivez pas les pertes ?", next: 'B5_NOSHOW_R1', scoreImpact: -15 }
    ]
  },

  'B5_NOSHOW_Y1': {
    id: 'B5_NOSHOW_Y1', tag: 'B5 : MÉTIER', type: 'yellow',
    question: "Tout le monde a des no-shows. Prétendre le contraire, c'est masquer une faille de suivi. Un moteur industriel gère l'imprévu automatiquement. On automatise ?",
    options: [
      { label: 'VERT', text: "On automatise ?", next: 'B5_ECHEC', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous niez ?", next: 'YELLOW_3', scoreImpact: -10 }
    ]
  },

  'B5_NOSHOW_R1': {
    id: 'B5_NOSHOW_R1', tag: 'B5 : ULTIMATUM', type: 'red',
    question: "Ne pas suivre les pertes, c'est jeter de l'argent par les fenêtres. Je n'investis pas dans des passoires. On bouche les trous ?",
    options: [
      { label: 'VERT', text: "On bouche les trous ?", next: 'B5_ECHEC', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous gardez la passoire ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B5_NOSHOW_Y1', scoreImpact: -10 }
    ]
  },

  'B5_ECHEC': {
    id: 'B5_ECHEC', tag: 'B5 : CONSÉQUENCES', type: 'main',
    question: "Si vous n'atteignez pas ces objectifs, êtes-vous prêt à vous résigner à l'échec ? Pourquoi régler ça maintenant ?",
    options: [
      { label: 'VERT', text: "C'est vital de régler ça ?", next: 'T5', scoreImpact: 10 },
      { label: 'JAUNE', text: "L'échec n'est pas grave ?", next: 'B5_ECHEC_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous remettez à plus tard ?", next: 'B5_ECHEC_R1', scoreImpact: -15 }
    ]
  },

  'B5_ECHEC_Y1': {
    id: 'B5_ECHEC_Y1', tag: 'B5 : STORY', type: 'yellow',
    question: "J'ai vu des dizaines de cabinets s'éteindre parce qu'ils pensaient que l'échec n'était pas grave. Le marché ne pardonne pas l'inertie. On règle ça ?",
    options: [
      { label: 'VERT', text: "On règle ça maintenant ?", next: 'T5', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous restez passif ?", next: 'YELLOW_3', scoreImpact: -10 }
    ]
  },

  'B5_ECHEC_R1': {
    id: 'B5_ECHEC_R1', tag: 'B5 : ULTIMATUM', type: 'red',
    question: "Remettre à plus tard, c'est décider d'échouer en silence. Je ne travaille qu'avec ceux qui ont le couteau sous la gorge ou la faim au ventre. Lequel êtes-vous ?",
    options: [
      { label: 'VERT', text: "J'ai la faim au ventre ?", next: 'T5', scoreImpact: 20 },
      { label: 'ROUGE', text: "Vous n'avez aucune urgence ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B5_ECHEC_Y1', scoreImpact: -10 }
    ]
  },

  'T5': {
    id: 'T5', tag: 'TRANSITION 5', type: 'transition',
    question: "Le diagnostic est froid, mais il est juste. On a la douleur, l'urgence, et la preuve que votre structure actuelle ne peut pas supporter vos ambitions sans un moteur industriel.",
    options: [{ label: 'SUIVANT', text: "Passer à l'engagement", next: 'B6_GOULOT', scoreImpact: 0 }]
  },

  // ── BLOCK 6 : ENGAGEMENT ET TRANSITION ─────────────────────────────────────

  'B6_GOULOT': {
    id: 'B6_GOULOT', tag: 'B6 : RÉSUMÉ', type: 'main',
    question: "On est d'accord que le goulot d'étranglement, c'est votre acquisition artisanale, et que vous voulez passer à un moteur industriel ?",
    options: [
      { label: 'VERT', text: "C'est exactement le résumé ?", next: 'B6_FIT', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous contestez ?", next: 'B6_GOULOT_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous hésitez encore ?", next: 'B6_GOULOT_R1', scoreImpact: -15 },
      { label: 'VIOLET', text: "Raccourci : Accord final", next: 'B6_PURPLE', scoreImpact: 20 }
    ]
  },

  'B6_PURPLE': {
    id: 'B6_PURPLE', tag: 'B6 : RÉCAPITULATIF', type: 'purple',
    question: "Le diagnostic est validé : l'acquisition artisanale est votre goulot d'étranglement. Vous êtes prêt à passer à la mécanique ?",
    options: [
      { label: 'VERT', text: "C'est exactement ça, passons à la suite.", next: 'BRIDGE', scoreImpact: 10 },
      { label: 'ROUGE', text: "Non, revenons en arrière.", next: 'B6_GOULOT', scoreImpact: -10 }
    ]
  },

  'B6_GOULOT_Y1': {
    id: 'B6_GOULOT_Y1', tag: 'B6 : AUTORITÉ', type: 'yellow',
    question: "Contester le diagnostic à ce stade est un aveu de peur. On a identifié les failles ensemble. On passe à la solution ou on reste dans le déni ?",
    options: [
      { label: 'VERT', text: "On passe à la solution ?", next: 'B6_FIT', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous restez dans le déni ?", next: 'YELLOW_2', scoreImpact: -10 }
    ]
  },

  'B6_GOULOT_R1': {
    id: 'B6_GOULOT_R1', tag: 'B6 : RÉALITÉ', type: 'red',
    question: "L'hésitation est le poison du succès. On a tout validé. On avance ?",
    options: [
      { label: 'VERT', text: "On avance ?", next: 'B6_FIT', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous persistez ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B6_GOULOT_Y1', scoreImpact: -10 }
    ]
  },

  'B6_FIT': {
    id: 'B6_FIT', tag: 'B6 : LE FIT', type: 'main',
    question: "Je pense qu'on a le bon fit. Si vous voulez, je peux vous montrer comment ma mécanique va vous emmener de A vers B. On y va ?",
    options: [
      { label: 'VERT', text: "Vous voulez voir la mécanique ?", next: 'BRIDGE', scoreImpact: 20 },
      { label: 'JAUNE', text: "Vous n'êtes pas convaincu ?", next: 'B6_FIT_Y1', scoreImpact: -10 },
      { label: 'ROUGE', text: "Vous refusez la démo ?", next: 'B6_FIT_R1', scoreImpact: -15 }
    ]
  },

  'B6_FIT_Y1': {
    id: 'B6_FIT_Y1', tag: 'B6 : PERFORMANCE', type: 'yellow',
    question: "Le fit se prouve par les résultats, pas par les paroles. Laissez-moi vous montrer la mécanique, vous jugerez sur pièce. On y va ?",
    options: [
      { label: 'VERT', text: "On y va ?", next: 'BRIDGE', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous refusez toujours ?", next: 'YELLOW_2', scoreImpact: -10 }
    ]
  },

  'B6_FIT_R1': {
    id: 'B6_FIT_R1', tag: 'B6 : ULTIMATUM', type: 'red',
    question: "Refuser de voir la solution après avoir validé le problème est un non-sens. On termine ce qu'on a commencé ?",
    options: [
      { label: 'VERT', text: "On termine ?", next: 'BRIDGE', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous bloquez ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'B6_FIT_Y1', scoreImpact: -10 }
    ]
  },

  // ── PONT ÉMOTIONNEL — NOUVEAU ────────────────────────────────────────────────
  'BRIDGE': {
    id: 'BRIDGE', tag: '🔗 PONT ÉMOTIONNEL', type: 'bridge',
    question: "Donc si je résume ce qu'on vient de poser ensemble : vous avez un pipeline aléatoire, vous perdez entre 15 et 20 heures par semaine sur des dossiers qui ne correspondent pas à votre niveau, et votre méthode actuelle ne vous permettra pas d'atteindre les 5 dossiers complexes par mois dont on a parlé. C'est bien ça ?",
    options: [
      { label: 'VERT', text: "C'est exactement ça.", next: 'PITCH', scoreImpact: 15 },
      { label: 'JAUNE', text: "Pas tout à fait…", next: 'BRIDGE_ADJUST', scoreImpact: -5 }
    ]
  },

  'BRIDGE_ADJUST': {
    id: 'BRIDGE_ADJUST', tag: '🔗 PONT — AJUSTEMENT', type: 'bridge',
    question: "Dites-moi ce que j'ai mal résumé — je veux être sûr qu'on parle du même problème avant de vous montrer la solution.",
    options: [
      { label: 'VERT', text: "Voici la correction…", next: 'PITCH', scoreImpact: 5 }
    ]
  },

  // ── PITCH ────────────────────────────────────────────────────────────────────
  'PITCH': {
    id: 'PITCH', tag: '🖥️ PITCH', type: 'info',
    question: "Parfait. Je vais vous montrer concrètement l'infrastructure dont je vous parlais. C'est un partage d'écran — je vous amène directement dans la salle des machines. Ce que vous allez voir, c'est exactement ce que vos futurs prospects voient avant d'arriver dans votre agenda. On regarde ça ensemble ?",
    options: [
      { label: 'UX CLIENT', text: "Ouvrir le pitch Montis Media", next: 'PITCH', scoreImpact: 0 },
      { label: 'SUIVANT', text: "Continuer au closing", next: 'CLOSING_START', scoreImpact: 0 }
    ]
  },

  // ── CLOSING ──────────────────────────────────────────────────────────────────

  // ── CORRECTION : formulation sans "honnête ?", ancrage sur ce qu'il a VU ──
  'CLOSING_START': {
    id: 'CLOSING_START', tag: "💎 L'ANNONCE (THE DROP)", type: 'main',
    question: "Basé sur ce qu'on vient de construire ensemble — vos chiffres dans le simulateur, votre agenda dans Sync, les dossiers que vous avez vus passer en temps réel — la prochaine étape c'est de sécuriser votre zone. Les 500€ d'activation, vous les avez vus sur la page — ils sont remboursés sur vos 6 premiers RDV. Votre risque réel, c'est zéro. On lance ?",
    options: [
      { label: 'OUI', text: "On lance la machine.", next: 'PAIEMENT', scoreImpact: 40, type: 'vert' },
      { label: 'NON', text: "J'ai un blocage (famille / temps / budget / pas urgent)", next: 'LOOP_L1', scoreImpact: -10, type: 'jaune' }
    ]
  },

  // ── CORRECTION : sans jauge explicite sur 10, question naturelle ────────────
  'LOOP_L1': {
    id: 'LOOP_L1', tag: 'LOOP 1 — LOGIQUE', type: 'main', isStrike: true,
    question: "Je comprends. Et au-delà de ce blocage-là, est-ce que l'idée de ne plus dépendre de votre réseau pour remplir votre agenda — d'avoir un flux qui tourne même quand vous êtes en vacances — est-ce que ça, c'est quelque chose qui a du sens pour vous ?",
    options: [
      { label: 'OUI', text: "Oui, ça a du sens.", next: 'LOOP_L3', scoreImpact: 10, type: 'vert' },
      { label: 'HÉSITE', text: "Je ne suis pas encore convaincu.", next: 'LOOP_L2', scoreImpact: -5, type: 'jaune' }
    ]
  },

  // ── CORRECTION : ancré sur Dr. Pierre G. vu dans le pitch ──────────────────
  'LOOP_L2': {
    id: 'LOOP_L2', tag: 'LOOP NIV 1 — SYSTÈME', type: 'main',
    question: "Souvenez-vous du dossier de Dr. Pierre G. — TMI 45%, 200k€ de capacité d'investissement. Ce profil-là, vous l'avez vu se faire prendre en temps réel. Avec d'autres méthodes, soit vous attendez que votre notaire vous appelle, soit vous faites du cold-calling. Ici, ces dossiers viennent à vous, pré-qualifiés, avant même que vous décrochiez le téléphone. La mécanique, elle est claire pour vous ?",
    options: [
      { label: 'OUI', text: "Oui, c'est clair.", next: 'LOOP_L3', scoreImpact: 15, type: 'vert' },
      { label: 'LOGIQUE', text: "C'est logique mais j'ai encore un doute.", next: 'LOOP_L3', scoreImpact: 5, type: 'jaune' }
    ]
  },

  // ── CORRECTION : ancré sur la garantie contractuelle ────────────────────────
  'LOOP_L3': {
    id: 'LOOP_L3', tag: 'LOOP NIV 2 — CONFIANCE', type: 'main',
    question: "Ce que peu de prestataires font dans ce secteur — et vous le savez mieux que moi — c'est s'engager par contrat sur un résultat. Pas sur des impressions, pas sur du trafic. Sur 20 RDV qualifiés livrés. Si on n'atteint pas l'objectif, on prolonge le sourcing jusqu'à la livraison complète, à nos frais. Vous avez vu cette garantie sur la page. Quel autre apporteur vous offre ça ?",
    options: [
      { label: 'OUI', text: "Aucun. On avance ensemble.", next: 'LOOP_L4', scoreImpact: 20, type: 'vert' },
      { label: 'HÉSITE', text: "Je comprends, mais j'hésite encore.", next: 'LOOP_L4', scoreImpact: -5, type: 'jaune' }
    ]
  },

  // ── CORRECTION : ancré sur ses mots du Bloc 5 (no-shows, Excel) ────────────
  'LOOP_L4': {
    id: 'LOOP_L4', tag: 'LOOP NIV 3 — URGENCE', type: 'main', isStrike: true,
    question: "Vous m'avez dit tout à l'heure que vous gérez encore les no-shows manuellement. Dans 6 mois, si on n'a rien changé, vous gérez encore les no-shows manuellement. La différence, c'est que pendant ces 6 mois, des dossiers BNC dans votre zone sont allés chez vos concurrents. Est-ce que vous êtes prêt à laisser ça se passer ?",
    options: [
      { label: 'NON', text: "Non, on change ça maintenant.", next: 'LOOP_L5', scoreImpact: 25, type: 'vert' },
      { label: 'HÉSITE', text: "C'est encore difficile de se projeter.", next: 'LOOP_L5', scoreImpact: -5, type: 'jaune' }
    ]
  },

  // ── CORRECTION : sans "je sens que vous voulez" ─────────────────────────────
  'LOOP_L5': {
    id: 'LOOP_L5', tag: 'LOOP NIV 4 — CONFIDENTIEL', type: 'main',
    question: "(Ton bas, confidentiel) Je vais vous dire quelque chose. La plupart des partenaires qui hésitent à cette étape me rappellent 3 semaines plus tard. Et en général, leur zone a déjà été allouée. Je ne dis pas ça pour vous presser — je dis ça parce que c'est factuel. La question ce n'est pas 'est-ce que je le fais'. La question c'est 'est-ce que je le fais maintenant ou est-ce que je laisse quelqu'un d'autre prendre ma place'.",
    options: [
      { label: 'OUI', text: "On lance maintenant.", next: 'LOOP_L6', scoreImpact: 30, type: 'vert' },
      { label: 'HÉSITE', text: "J'ai encore une petite hésitation.", next: 'LOOP_L6', scoreImpact: -5, type: 'jaune' }
    ]
  },

  // ── CORRECTION : version zone exclusive, sans "je sens" ─────────────────────
  'LOOP_L6': {
    id: 'LOOP_L6', tag: 'LOOP 5 — SCARCITY', type: 'main', isStrike: true,
    question: "On a 2 slots ce mois-ci. L'un d'eux couvre votre département. Si on valide maintenant, votre zone est verrouillée — aucun autre cabinet dans votre secteur ne peut recevoir les mêmes profils. Si on attend, je ne peux pas vous garantir que ce slot sera encore disponible à notre prochain échange. C'est maintenant ou c'est le prochain cycle dans 30 jours. Qu'est-ce qu'on fait ?",
    options: [
      { label: 'OUI', text: "On sécurise ma zone maintenant.", next: 'PAIEMENT', scoreImpact: 40, type: 'vert' },
      { label: 'HÉSITE', text: "Je veux encore réfléchir.", next: 'LOOP_L7', scoreImpact: -10, type: 'jaune' }
    ]
  },

  // ── CORRECTION : dernière chance avant mandat ────────────────────────────────
  'LOOP_L7': {
    id: 'LOOP_L7', tag: 'LOOP 6 — DERNIER VERROU', type: 'main',
    question: "On a fait le tour ensemble — la logique, la confiance, l'urgence. Si après tout ça il reste un blocage, c'est qu'il y a quelque chose de précis que je n'ai pas adressé. Dites-moi exactement ce qui vous retient et on le règle maintenant. Parce que si on ne le règle pas maintenant, on ne le réglera pas.",
    options: [
      { label: 'OUI', text: "Voici mon vrai blocage…", next: 'CLOSING_START', scoreImpact: -20, type: 'vert' },
      { label: 'NON', text: "Je veux vraiment réfléchir.", next: 'LOOP_EXIT', scoreImpact: -30, type: 'jaune' }
    ]
  },

  // ── NOUVEAU : sortie mandat 48h — remplace la disqualification ───────────────
  'LOOP_EXIT': {
    id: 'LOOP_EXIT', tag: '📩 SORTIE — MANDAT 48H', type: 'exit',
    question: "Je comprends tout à fait. Voilà ce qu'on va faire — je vous envoie dans les prochaines minutes le modèle de convention via Calendly. Il récapitule exactement ce dont on a parlé aujourd'hui : les conditions, la garantie, les modalités. Vous avez 48h pour le parcourir à tête reposée et me faire un retour. Si après ça vous décidez que ce n'est pas le bon moment, aucun problème — au moins vous aurez tout en main pour décider en connaissance de cause.",
    options: []
  },

  // ── FIN DE DÉCOUVERTE (avant pitch) — disqualification douce ────────────────
  'DISQUALIFY': {
    id: 'DISQUALIFY', tag: 'SORTIE DOUCE', type: 'end',
    question: "Je comprends. Ce n'est pas le bon moment et c'est parfaitement normal. Je vous envoie notre présentation par email — consultez-la quand vous êtes prêt. Si le sujet redevient pertinent dans 3 ou 6 mois, vous savez où me trouver. Je ne ferme jamais une porte.",
    options: []
  },

  // ── PAIEMENT ─────────────────────────────────────────────────────────────────
  'PAIEMENT': {
    id: 'PAIEMENT', tag: '💳 PROCÉDURE DE PAIEMENT', type: 'end',
    question: "Parfait. J'ai un lien sécurisé devant moi. Quel est le nom exact qui figure sur la carte bancaire de la société ?",
    options: []
  },

  // ── ESCALADES UNIVERSELLES ───────────────────────────────────────────────────

  'YELLOW_1': {
    id: 'YELLOW_1', tag: 'JAUNE 1 : PERFORMANCE', type: 'yellow',
    question: "J'investis mon propre budget sur mes partenaires. Avant de parler solution, on va s'assurer que votre structure peut absorber mes flux. On est d'accord sur le principe ?",
    options: [
      { label: 'VERT', text: "L'audit est logique ?", next: 'RECOVERY_POINT', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous êtes toujours impatient ?", next: 'YELLOW_2', scoreImpact: -10 }
    ]
  },

  'YELLOW_2': {
    id: 'YELLOW_2', tag: 'JAUNE 2 : STORY', type: 'yellow',
    question: "Au début, je prenais tout le monde. Résultat : crash. Leurs cabinets n'avaient pas l'Indice d'Absorption requis. Je refuse de répéter cette erreur. On valide votre châssis ?",
    options: [
      { label: 'VERT', text: "Mon expérience fait sens ?", next: 'RECOVERY_POINT', scoreImpact: 10 },
      { label: 'JAUNE', text: "Vous refusez l'audit ?", next: 'YELLOW_3', scoreImpact: -10 }
    ]
  },

  'YELLOW_3': {
    id: 'YELLOW_3', tag: 'JAUNE 3 : MÉTIER', type: 'yellow',
    question: "Vous êtes CGP. Vous ne faites jamais de préconisation sans audit patrimonial. Pourquoi accepterais-je de vous greffer mon système sans auditer votre acquisition ?",
    options: [
      { label: 'VERT', text: "On travaille de la même façon ?", next: 'RECOVERY_POINT', scoreImpact: 10 },
      { label: 'ROUGE', text: "Vous restez fermé ?", next: 'RED_3', scoreImpact: -10 }
    ]
  },

  'RED_1': {
    id: 'RED_1', tag: 'ROUGE 1 : RÉALITÉ', type: 'red',
    question: "Un dirigeant qui va bien ne perd pas 45 min par simple curiosité. La curiosité ne paie pas les factures de votre cabinet, on est d'accord ?",
    options: [
      { label: 'VERT', text: "On attaque les vrais sujets ?", next: 'RECOVERY_POINT', scoreImpact: 10 },
      { label: 'ROUGE', text: "Tout va bien pour vous ?", next: 'RED_2', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'YELLOW_1', scoreImpact: -10 }
    ]
  },

  'RED_2': {
    id: 'RED_2', tag: 'ROUGE 2 : PARADOXE', type: 'red',
    question: "Si tout va parfaitement bien, pourquoi cherchez-vous à modifier votre flux d'acquisition ? Le temps d'un CGP vaut cher, le mien aussi.",
    options: [
      { label: 'VERT', text: "Il y a une faille à combler ?", next: 'RECOVERY_POINT', scoreImpact: 15 },
      { label: 'ROUGE', text: "Vous restez sur la défensive ?", next: 'RED_3', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous attaquez ma légitimité ?", next: 'YELLOW_1', scoreImpact: -10 }
    ]
  },

  'RED_3': {
    id: 'RED_3', tag: 'ROUGE 3 : ULTIMATUM', type: 'red',
    question: "Je cherche des partenaires d'élite prêts à scaler, pas des touristes de l'information. On joue carte sur table sur vos chiffres ?",
    options: [
      { label: 'VERT', text: "On parle chiffres ?", next: 'RECOVERY_POINT', scoreImpact: 20 },
      { label: 'ROUGE', text: "Vous refusez de vous ouvrir ?", next: 'LOOP_BACK', scoreImpact: -10 },
      { label: 'JAUNE', text: "Vous contestez mon autorité ?", next: 'YELLOW_1', scoreImpact: -10 }
    ]
  }
};

// ─── B3 Data ──────────────────────────────────────────────────────────────────

const B3_DATA: Record<string, { title: string; steps: { q: string; y: string; r: string }[] }> = {
  'LI_LIKE': {
    title: "LinkedIn (Apprécié)", steps: [
      { q: "LinkedIn est l'outil roi pour le B2B. Vous appréciez le côté 'chirurgical' de la plateforme ?", y: "C'est un outil, pas une solution miracle. On reste concentré ?", r: "Si c'était si parfait, vous ne seriez pas en train de stagner. On creuse ?" },
      { q: "Mais entre les messages automatisés et le 'social selling', vous arrivez vraiment à sortir du lot sans y passer 3h par jour ?", y: "Le temps est votre ressource la plus précieuse. On l'optimise ?", r: "Passer sa journée à chasser sur LinkedIn n'est pas un business model scalable. On est d'accord ?" },
      { q: "Le problème, c'est que tout le monde fait la même chose. Vous ne saturez pas de recevoir 10 demandes de connexion identiques par semaine ?", y: "La saturation est le signe d'un marché qui rejette la méthode. On change d'approche ?", r: "Si vous faites comme tout le monde, vous obtenez les mêmes résultats médiocres. On avance ?" },
      { q: "Si vous êtes noyé dans la masse, comment pouvez-vous prétendre être l'expert exclusif dont ils ont besoin ?", y: "L'autorité ne se décrète pas, elle se construit par la rareté. On la crée ?", r: "Un expert ne court pas après les clients sur les réseaux. On valide ce point ?" }
    ]
  },
  'LI_DISLIKE': {
    title: "LinkedIn (Rejeté)", steps: [
      { q: "Vous avez raison, LinkedIn est devenu une jungle de spam. C'est ce côté impersonnel qui vous a refroidi ?", y: "Le spam est le cancer du digital. On cherche plus de qualité ?", r: "Rejeter l'outil sans avoir la méthode est une erreur. On regarde pourquoi ça a échoué ?" },
      { q: "Pourtant, c'est là que se trouve votre cible. Vous avez essayé d'y aller mais sans méthode, c'est ça ?", y: "La méthode fait 90% du travail. On la définit ?", r: "Y aller à l'aveugle est le meilleur moyen de se brûler. On est d'accord ?" },
      { q: "Le rejet vient souvent d'une mauvaise expérience. Vous avez eu l'impression de perdre votre temps pour des résultats nuls ?", y: "Le temps perdu ne se rattrape pas. On arrête l'hémorragie ?", r: "L'inefficacité est frustrante pour un pro comme vous. On passe à autre chose ?" },
      { q: "On est d'accord : sans un système qui filtre pour vous, LinkedIn est juste un gouffre à temps improductif ?", y: "Le filtrage est la clé de la sérénité. On l'installe ?", r: "Un gouffre à temps est un poison pour votre CA. On valide ?" }
    ]
  },
  'LEADS_TESTED': {
    title: "Leads (Testés)", steps: [
      { q: "L'achat de leads semble être le raccourci idéal pour remplir l'agenda. C'est ce qui vous a séduit au départ ?", y: "Les raccourcis cachent souvent des impasses. On analyse ?", r: "La facilité a un prix que vous payez aujourd'hui. On regarde les dégâts ?" },
      { q: "Pour traiter ces fiches, vous avez une équipe dédiée ou c'est vous qui passez les 50 appels quotidiens entre deux rendez-vous ?", y: "Votre temps de CGP est trop cher pour faire du phoning. On délègue ?", r: "Faire le travail d'un stagiaire n'est pas digne de votre expertise. On est d'accord ?" },
      { q: "Vous avez calculé le coût réel en énergie de se faire raccrocher au nez 45 fois par jour par des gens qui n'ont rien demandé ?", y: "L'énergie est le moteur de votre closing. On l'économise ?", r: "C'est une méthode de survie, pas de croissance. On change de braquet ?" },
      { q: "Un CGP de votre rang qui fait du cold-calling bas de gamme... vous ne pensez pas que ça détruit instantanément votre autorité ?", y: "L'autorité est votre actif n°1. On le protège ?", r: "Les clients fortunés ne répondent pas au cold-calling. On valide la réalité ?" }
    ]
  },
  'LEADS_ENVISAGED': {
    title: "Leads (Envisagés)", steps: [
      { q: "Beaucoup de vos confrères y pensent pour déléguer la prospection. C'est la promesse de volume qui vous attire ?", y: "Le volume sans qualité est un mirage. On reste vigilant ?", r: "Vouloir déléguer sans système est un suicide opérationnel. On en parle ?" },
      { q: "Vous imaginez vraiment qu'un lead vendu à 5 autres cabinets en même temps va vous attendre sagement ?", y: "La concurrence sur une même fiche détruit la marge. On cherche l'exclusivité ?", r: "C'est une course vers le bas. Vous voulez vraiment participer à ça ?" },
      { q: "Êtes-vous prêt à transformer votre cabinet en centre d'appels pour espérer un taux de transformation de 2% ?", y: "Votre cabinet mérite mieux qu'un script de call-center. On monte en gamme ?", r: "2% de transfo, c'est de l'acharnement, pas du business. On est d'accord ?" },
      { q: "Est-ce que cette image de 'vendeur de foire' est vraiment celle que vous voulez projeter à vos futurs clients ?", y: "Votre image est votre signature. On la soigne ?", r: "Un expert est sollicité, il ne quémande pas. On valide ce principe ?" }
    ]
  },
  'APPORT': {
    title: "Apport d'affaires", steps: [
      { q: "L'apport d'affaires, c'est confortable. On attend que le téléphone sonne. C'est votre source principale aujourd'hui ?", y: "Le confort est le lit de l'inertie. On cherche du dynamisme ?", r: "Attendre n'est pas une stratégie, c'est un espoir. On passe à l'action ?" },
      { q: "Mais vous dépendez totalement du bon vouloir d'un tiers. S'il arrête demain, votre cabinet s'arrête aussi ?", y: "La dépendance est une vulnérabilité majeure. On reprend le contrôle ?", r: "Vous avez construit votre boîte sur du sable. On coule du béton ?" },
      { q: "Et la commission que vous reversez... vous ne trouvez pas que c'est une taxe énorme sur votre propre expertise ?", y: "Votre expertise mérite 100% de la valeur créée. On optimise ?", r: "Payer pour travailler est un non-sens économique. On est d'accord ?" },
      { q: "Être le sous-traitant d'un autre... est-ce vraiment ça, être le patron de sa propre croissance ?", y: "Un patron dirige, il ne subit pas. On reprend les commandes ?", r: "La croissance doit être interne et maîtrisée. On valide ?" }
    ]
  },
  'PARTENARIAT': {
    title: "Partenariats institutionnels", steps: [
      { q: "Les banques ou experts-comptables sont des mines d'or théoriques. Vous avez des accords solides en place ?", y: "La théorie et la pratique sont deux mondes différents. On vérifie ?", r: "Si c'était si rentable, vous ne seriez pas là. On regarde la vérité ?" },
      { q: "Le problème, c'est que vous passez après tout le monde. On vous envoie les dossiers dont ils ne veulent pas, non ?", y: "Récupérer les restes n'est pas une stratégie d'élite. On monte en gamme ?", r: "Vous méritez le premier choix, pas les miettes. On est d'accord ?" },
      { q: "Vous passez combien de temps à 'entretenir' ces relations pour des miettes de business ?", y: "Le temps de networking doit être rentable. On calcule le ROI ?", r: "C'est de la politique, pas du business. On revient à l'efficacité ?" },
      { q: "Un partenariat où vous n'avez pas le contrôle du flux... c'est une cage dorée, vous ne trouvez pas ?", y: "La liberté commence par le contrôle de son flux. On le prend ?", r: "Une cage reste une cage, même dorée. On s'en libère ?" }
    ]
  },
  'RECO': {
    title: "Recommandation", steps: [
      { q: "La recommandation est la preuve de votre qualité. C'est gratifiant, n'est-ce pas ?", y: "La gratitude ne paie pas les investissements. On cherche du volume ?", r: "C'est le minimum syndical, pas un levier de croissance. On avance ?" },
      { q: "Mais c'est un flux passif. Vous ne pouvez pas 'commander' 10 recommandations pour le mois prochain ?", y: "L'imprévisibilité est le stress de l'entrepreneur. On la supprime ?", r: "On ne pilote pas un avion à la météo. On installe un radar ?" },
      { q: "Et souvent, les amis des clients ne sont pas forcément vos clients idéaux. Vous ne perdez pas du temps sur des dossiers trop petits ?", y: "La qualification est absente de la recommandation. On la rajoute ?", r: "Traiter des petits dossiers vous empêche de voir les gros. On est d'accord ?" },
      { q: "Compter uniquement sur la chance pour scaler... c'est un pari risqué pour un entrepreneur sérieux, non ?", y: "Le sérieux impose de la prédictibilité. On la construit ?", r: "La chance n'est pas un plan d'affaires. On valide ?" }
    ]
  }
};

// ─── Components ───────────────────────────────────────────────────────────────

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex gap-1 w-full max-w-2xl mx-auto px-4 py-6">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div key={i} className={`h-0.5 flex-1 transition-all duration-500 ${i < currentStep ? 'bg-white' : 'bg-zinc-800'}`} />
    ))}
  </div>
);

const CertitudeMeter = ({ score }: { score: number }) => {
  const color = useMemo(() => {
    if (score < 40) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
    if (score < 70) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
    return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
  }, [score]);
  return (
    <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-lg backdrop-blur-sm">
      <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Certitude</span>
      <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} className={`h-full transition-all duration-500 ${color}`} />
      </div>
      <span className="text-xs font-mono font-bold text-white w-8">{score}%</span>
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [isAppStarted, setIsAppStarted] = useState(false);
  const [checklist, setChecklist] = useState({ meeting: false, recording: false });
  const [currentNodeId, setCurrentNodeId] = useState('INTRO');
  const [lastMainNodeId, setLastMainNodeId] = useState('INTRO');
  const [score, setScore] = useState(50);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedB3Options, setSelectedB3Options] = useState<string[]>([]);
  const [currentB3OptionIndex, setCurrentB3OptionIndex] = useState(-1);

  const currentNode = useMemo(() => {
    if (currentNodeId.startsWith('B3_OPT_')) {
      const match = currentNodeId.match(/^B3_OPT_(.+)_S(\d)(?:_([YR]))?$/);
      if (!match) return SCRIPT[currentNodeId];
      const optId = match[1], stepIdx = parseInt(match[2]) - 1, variant = match[3];
      const optData = B3_DATA[optId];
      if (!optData) return SCRIPT[currentNodeId];
      const stepData = optData.steps[stepIdx];
      if (!stepData) return SCRIPT[currentNodeId];
      let question = stepData.q;
      let type: NodeType = 'main';
      const tag = `B3 : ${optData.title} (${stepIdx + 1}/4)`;
      if (variant === 'Y') { question = stepData.y; type = 'yellow'; }
      else if (variant === 'R') { question = stepData.r; type = 'red'; }
      const isLastStep = stepIdx === 3;
      const isLastOption = currentB3OptionIndex === selectedB3Options.length - 1;
      let nextGreen = isLastStep ? (isLastOption ? 'B3_PURPLE' : `B3_OPT_${selectedB3Options[currentB3OptionIndex + 1]}_S1`) : `B3_OPT_${optId}_S${stepIdx + 2}`;
      const options: Option[] = variant
        ? [{ label: 'SUIVANT', text: "Reprendre la ligne droite", next: nextGreen, scoreImpact: 5 }]
        : [
            { label: 'VERT', text: "Acquiescement", next: nextGreen, scoreImpact: 10 },
            { label: 'JAUNE', text: "Objection légère", next: `${currentNodeId}_Y`, scoreImpact: -5 },
            { label: 'ROUGE', text: "Résistance forte", next: `${currentNodeId}_R`, scoreImpact: -10 }
          ];
      return { id: currentNodeId, tag, type, question, options };
    }
    return SCRIPT[currentNodeId];
  }, [currentNodeId, currentB3OptionIndex, selectedB3Options]);

  const mainPathNodes = useMemo(() =>
    Object.values(SCRIPT).filter(n => ['main','info','transition','multi-select','bridge'].includes(n.type)).map(n => n.id), []);
  const currentProgress = useMemo(() => mainPathNodes.indexOf(lastMainNodeId) + 1, [lastMainNodeId, mainPathNodes]);

  const handleOptionClick = (option: Option) => {
    if (option.label === 'UX CLIENT') {
      window.open('https://montismedia.com/03-ux-client', '_blank');
      return;
    }
    let nextId = option.next;
    if (nextId === 'RECOVERY_POINT') nextId = lastMainNodeId;
    else if (nextId === 'LOOP_BACK') nextId = lastMainNodeId;
    else if (nextId === 'B3_PROCESS') {
      if (selectedB3Options.length === 0) return;
      setCurrentB3OptionIndex(0);
      nextId = `B3_OPT_${selectedB3Options[0]}_S1`;
    }
    if (nextId.startsWith('B3_OPT_')) {
      const match = nextId.match(/^B3_OPT_(.+)_S(\d)(?:_([YR]))?$/);
      if (match) { setCurrentB3OptionIndex(selectedB3Options.indexOf(match[1])); }
    }
    setHistory(prev => [...prev, currentNodeId]);
    setScore(prev => Math.min(100, Math.max(0, prev + option.scoreImpact)));
    setCurrentNodeId(nextId);
    const nextNode = SCRIPT[nextId] || (nextId.startsWith('B3_OPT_') && !nextId.endsWith('_Y') && !nextId.endsWith('_R') ? { type: 'main' } : null);
    if (nextNode && ['main','info','transition','multi-select','bridge'].includes(nextNode.type as string)) setLastMainNodeId(nextId);
  };

  const toggleB3Option = (optId: string) =>
    setSelectedB3Options(prev => prev.includes(optId) ? prev.filter(id => id !== optId) : [...prev, optId]);

  const goBack = () => {
    if (history.length === 0) return;
    const prevId = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentNodeId(prevId);
    const prevNode = SCRIPT[prevId];
    if (prevNode && ['main','info','transition','bridge'].includes(prevNode.type)) setLastMainNodeId(prevId);
  };

  const reset = () => { setCurrentNodeId('B1_SON'); setLastMainNodeId('B1_SON'); setScore(50); setHistory([]); };

  const getTensionColor = (type: NodeType) => {
    switch (type) {
      case 'yellow': return 'border-yellow-500 text-yellow-50';
      case 'red': return 'border-red-500 text-red-50';
      case 'purple': return 'border-violet-500 text-violet-50';
      case 'transition': return 'border-emerald-500 text-emerald-50';
      case 'bridge': return 'border-blue-400 text-blue-50';
      case 'exit': return 'border-orange-400 text-orange-50';
      case 'info': return 'border-zinc-600 text-zinc-300';
      default: return 'border-zinc-800 text-white';
    }
  };

  // ── Écran de démarrage ───────────────────────────────────────────────────────
  if (!isAppStarted) {
    return (
      <div className="min-h-screen bg-black text-zinc-300 font-sans flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-black tracking-[0.5em] text-white uppercase mb-2">Wolf.OS</h1>
            <p className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">Checklist de départ</p>
          </div>
          <div className="space-y-4 mb-8">
            {[
              { key: 'meeting' as const, label: 'Lancer la réunion' },
              { key: 'recording' as const, label: "Lancer l'enregistrement réunion" }
            ].map(({ key, label }) => (
              <button key={key} onClick={() => setChecklist(prev => ({ ...prev, [key]: !prev[key] }))}
                className={`flex items-center w-full p-4 rounded-xl border transition-all ${checklist[key] ? 'bg-emerald-500/10 border-emerald-500/50 text-white' : 'bg-zinc-900/20 border-zinc-800 text-zinc-400'}`}>
                <div className={`w-5 h-5 rounded border mr-4 flex items-center justify-center ${checklist[key] ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700'}`}>
                  {checklist[key] && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setIsAppStarted(true)} disabled={!checklist.meeting || !checklist.recording}
            className="w-full py-4 bg-white text-black font-bold tracking-widest uppercase rounded-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:bg-zinc-200">
            Commencer l'appel
          </button>
        </motion.div>
      </div>
    );
  }

  // ── App principale ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-zinc-800">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xs font-black tracking-[0.5em] text-white uppercase">Wolf.OS</h1>
          <span className="text-[8px] font-bold tracking-[0.2em] text-zinc-500 uppercase mt-1">Straight Line Engine</span>
        </div>
        <CertitudeMeter score={score} />
      </header>

      <ProgressBar currentStep={currentProgress} totalSteps={mainPathNodes.length} />

      <main className="max-w-3xl mx-auto px-6 pb-24">
        <div className="mb-6">
          <button onClick={goBack} disabled={history.length === 0}
            className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-zinc-500 hover:text-white disabled:opacity-0 transition-all">
            <ChevronLeft size={14} />Précédent
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentNodeId}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 md:p-12 shadow-2xl overflow-hidden">

              {/* Tag */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-zinc-500 uppercase border border-zinc-800 px-2 py-1 rounded">
                    {currentNode.tag}
                  </span>
                  {currentNode.type === 'yellow' && <AlertTriangle size={14} className="text-yellow-500" />}
                  {currentNode.type === 'red' && <Activity size={14} className="text-red-500" />}
                  {currentNode.type === 'purple' && <ShieldCheck size={14} className="text-violet-500" />}
                  {currentNode.type === 'transition' && <ShieldCheck size={14} className="text-emerald-500" />}
                  {currentNode.type === 'bridge' && <ArrowRight size={14} className="text-blue-400" />}
                  {currentNode.type === 'exit' && <ExternalLink size={14} className="text-orange-400" />}
                </div>
                {currentNode.id.includes('LOOP_L') && (
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6,7].map(l => (
                      <div key={l} className={`w-4 h-1 rounded-full ${currentNode.id === `LOOP_L${l}` ? 'bg-blue-500' : 'bg-zinc-800'}`} />
                    ))}
                  </div>
                )}
              </div>

              {/* Question */}
              <h2 className={`text-2xl md:text-3xl font-light leading-tight mb-12 pl-6 border-l-2 ${currentNode.isStrike ? 'border-blue-500 italic' : getTensionColor(currentNode.type)}`}>
                {['yellow','red'].includes(currentNode.type) || currentNode.isStrike
                  ? <span className="italic opacity-90">"{currentNode.question}"</span>
                  : currentNode.question}
              </h2>

              {/* Options */}
              <div className="grid gap-3">
                {currentNode.type === 'multi-select' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                      {currentNode.options.filter(o => o.label === 'INFO').map((option, idx) => {
                        const isSelected = selectedB3Options.includes(option.next);
                        return (
                          <button key={idx} onClick={() => toggleB3Option(option.next)}
                            className={`flex items-center w-full text-left p-4 rounded-xl border transition-all duration-200 ${isSelected ? 'bg-emerald-500/20 border-emerald-500/50 text-white' : 'bg-zinc-900/20 border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                            <div className={`w-4 h-4 rounded border mr-4 flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700'}`}>
                              {isSelected && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <span className="text-sm font-medium">{option.text}</span>
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={() => handleOptionClick(currentNode.options.find(o => o.label === 'SUIVANT')!)}
                      disabled={selectedB3Options.length === 0}
                      className="group relative flex items-center justify-center w-full p-5 rounded-xl border bg-emerald-500/10 border-emerald-500/50 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      <span className="text-sm font-bold tracking-widest uppercase text-emerald-400">
                        Démarrer l'analyse ({selectedB3Options.length})
                      </span>
                      <ArrowRight size={18} className="ml-4 text-emerald-400" />
                    </button>
                  </>
                ) : currentNode.options.length > 0 ? (
                  currentNode.options.map((option, idx) => {
                    const optType = option.type || (
                      option.label === 'VERT' ? 'vert' :
                      option.label === 'JAUNE' || option.label === 'HÉSITE' || option.label === 'LOGIQUE' ? 'jaune' :
                      option.label === 'ROUGE' ? 'rouge' :
                      option.label === 'VIOLET' ? 'violet' : 'info'
                    );
                    const isUxClient = option.label === 'UX CLIENT';
                    return (
                      <button key={idx} onClick={() => handleOptionClick(option)}
                        className={`group relative flex items-center w-full text-left p-5 rounded-xl border transition-all duration-200 ${
                          optType === 'vert' ? 'bg-emerald-500/5 border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/10' :
                          optType === 'jaune' ? 'bg-yellow-500/5 border-zinc-800 hover:border-yellow-500/50 hover:bg-yellow-500/10' :
                          optType === 'rouge' ? 'bg-red-500/5 border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10' :
                          optType === 'violet' ? 'bg-violet-500/5 border-zinc-800 hover:border-violet-500/50 hover:bg-violet-500/10' :
                          isUxClient ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20' :
                          'bg-zinc-900/20 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/40'
                        }`}>
                        <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded mr-4 min-w-[60px] text-center ${
                          optType === 'vert' ? 'bg-emerald-500/20 text-emerald-400' :
                          optType === 'jaune' ? 'bg-yellow-500/20 text-yellow-400' :
                          optType === 'rouge' ? 'bg-red-500/20 text-red-400' :
                          optType === 'violet' ? 'bg-violet-500/20 text-violet-400' :
                          isUxClient ? 'bg-blue-500/20 text-blue-400' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {isUxClient ? <ExternalLink size={10} className="inline" /> : option.label}
                        </span>
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors flex-1">
                          {option.text}
                        </span>
                        <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    );
                  })
                ) : (
                  /* Écrans de fin */
                  <div className="text-center py-12">
                    {currentNode.id === 'PAIEMENT' ? (
                      <div className="flex flex-col items-center gap-6 py-8">
                        <CheckCircle2 size={64} className="text-emerald-500 mb-2" />
                        <p className="text-emerald-400 font-bold tracking-widest uppercase mb-4">CLOSING RÉUSSI</p>
                        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center gap-4 mb-6">
                          <code className="text-sm text-zinc-300">montismedia.com/activation</code>
                          <button onClick={() => { navigator.clipboard.writeText('montismedia.com/activation'); }}
                            className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase rounded-lg hover:bg-zinc-200 transition-all">
                            Copier
                          </button>
                        </div>
                        <button onClick={reset} className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all">
                          Nouvel appel
                        </button>
                      </div>
                    ) : currentNode.id === 'LOOP_EXIT' ? (
                      <div className="flex flex-col items-center gap-6 py-8">
                        <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/50 flex items-center justify-center mb-2">
                          <ExternalLink size={28} className="text-orange-400" />
                        </div>
                        <p className="text-orange-400 font-bold tracking-widest uppercase mb-2">MANDAT 48H ENVOYÉ</p>
                        <p className="text-zinc-400 text-sm max-w-xs mx-auto text-center leading-relaxed mb-6">
                          Envoyez le modèle de convention via Calendly. Le prospect a 48h pour revenir.
                        </p>
                        <button onClick={reset} className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all">
                          Nouvel appel
                        </button>
                      </div>
                    ) : currentNode.id === 'DISQUALIFY' ? (
                      <div className="flex flex-col items-center gap-6 py-8">
                        <XCircle size={64} className="text-zinc-600 mb-2" />
                        <p className="text-zinc-400 font-bold tracking-widest uppercase mb-2">SORTIE DOUCE</p>
                        <p className="text-zinc-500 text-sm max-w-xs mx-auto text-center leading-relaxed mb-6">
                          Envoyez la présentation par email. Laissez la porte ouverte.
                        </p>
                        <button onClick={reset} className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all">
                          Nouvel appel
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <CheckCircle2 size={48} className="text-emerald-500 mb-2" />
                        <p className="text-zinc-400">Session terminée.</p>
                        <button onClick={reset} className="mt-4 px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold tracking-widest uppercase rounded-full transition-all">
                          Recommencer
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 pointer-events-none">
        <div className="max-w-3xl mx-auto flex justify-between items-end opacity-20">
          <div className="text-[10px] font-mono tracking-tighter">
            SYSTEM_STATUS: ACTIVE<br />VELVET_WOLF_PROTOCOL: ENABLED
          </div>
          <div className="text-[10px] font-mono tracking-tighter text-right">
            JORDAN_BELFORT_METHODOLOGY<br />v5.0_STABLE
          </div>
        </div>
      </footer>
    </div>
  );
}
