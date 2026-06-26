/**
 * One-off migration: remove image-based stimuli from gold mock manifests.
 * Replaces picture/image prompts with text-only scene descriptions.
 *
 * Usage: node scripts/migrate-gold-mocks-no-images.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFESTS_DIR = path.join(
  __dirname,
  "../src/lib/cambridge-assessment/gold-mocks/manifests"
);

/** Text scene for writing tasks keyed by question ref. */
const WRITING_SCENES = {
  "sgm-036":
    "A girl and her mum are in the kitchen. Mum is washing vegetables and the girl is setting the table.",
  "sgm-037": "A grey cat is sitting on the window sill and looking outside at the garden.",
  "sgm-038": "Three children are in a classroom. They are drawing colourful pictures at their desks.",
  "sgm-039":
    "There is a park with green trees, a playground, and children playing on the grass.",
  "sgm-040":
    "Two children are walking on a rainy street. They are wearing yellow raincoats and holding umbrellas.",
  "sgm2-036": "A boy is sitting on the sofa with his brown dog. The dog is resting its head on his lap.",
  "sgm2-037": "Mum is cooking dinner in the kitchen. There are pots on the stove and fruit on the counter.",
  "sgm2-038": "Five ducks are swimming on a pond in the park on a sunny day.",
  "sgm2-039":
    "Children are playing on swings and a slide in a busy playground after school.",
  "sgm2-040":
    "There is a garden with flowers, a rabbit in a hutch, and a dog running on the grass.",
  "sgm3-036":
    "There is a bowl of apples, bananas, and oranges on the kitchen table.",
  "sgm3-037": "A boy is kicking a football on a field near some trees.",
  "sgm3-038":
    "A family is at the airport with suitcases, waiting near the check-in desk.",
  "sgm3-039":
    "Children are swimming and playing in an outdoor pool on a hot summer day.",
  "sgm3-040":
    "A family is having a picnic on the beach. There is a blanket, food, and the sea behind them.",
  "mgm-043": "A tall giraffe is eating leaves from a tree at the zoo.",
  "mgm-044": "Children are playing football and riding bikes in a sunny park.",
  "mgm-047":
    "People are buying fruit and vegetables at a busy outdoor market.",
  "mgm-048":
    "Two teams are playing a football match. One player is kicking the ball towards the goal.",
  "mgm2-043":
    "Dark clouds are over a town and lightning is flashing during a thunderstorm.",
  "mgm2-044": "A chef in a white hat is cooking pasta in a busy restaurant kitchen.",
  "mgm2-047":
    "Students are working quietly on computers in a school computer lab.",
  "mgm2-048":
    "People are walking along a wet street with umbrellas while cars drive slowly.",
  "mgm3-043": "A dentist is checking a child's teeth in a bright dental clinic.",
  "mgm3-044":
    "Children in colourful costumes are dancing at an outdoor festival.",
  "mgm3-047":
    "People are sorting plastic bottles and paper into recycling bins at a recycling centre.",
  "mgm3-048":
    "A healthy lunch with salad, fruit, and water is on a table in the school canteen.",
  "fgm-053":
    "Fishing boats are in a harbour. Seagulls are flying and people are walking on the pier.",
  "fgm-054":
    "A busy city square has a fountain, shops, and people sitting at outdoor cafés.",
  "fgm2-055":
    "Stallholders are selling fruit, clothes, and snacks at a busy community market.",
  "fgm2-056":
    "A hobby room has model kits on one table and children painting at another.",
  "fgm3-055":
    "A waterfall flows into a river. Hikers are resting nearby and birds are in the trees.",
  "fgm3-056":
    "Visitors are enjoying a leisure park with a lake, picnic area, and cycling paths.",
};

/** Text descriptions for speaking spot-the-difference tasks. */
const SPEAKING_PAIR_SCENES = {
  "sgm-041":
    "Scene A: A living room with toys on the floor, a blue sofa, a lamp on the left table, and a cat under the chair.\nScene B: The same room with no toys on the floor, a red sofa, the lamp on the right table, and no cat.",
  "sgm2-041":
    "Scene A: A park with two ducks on the pond, a boy on the swing, and a red kite in the sky.\nScene B: The same park with four ducks, no boy on the swing, and a blue kite.",
  "sgm3-041":
    "Scene A: A sports hall with a basketball on the floor, five children, and an open door.\nScene B: The same hall with a football, three children, and a closed door.",
  "mgm-049":
    "Scene A: A sunny park with children on the grass, a dog running, and flowers in bloom.\nScene B: The same park on a rainy day with empty benches, no dog, and grey skies.",
  "mgm2-049":
    "Scene A: A town street on a sunny day with people in T-shirts and open shop doors.\nScene B: The same street in heavy rain with umbrellas, wet roads, and closed café tables.",
  "mgm3-049":
    "Scene A: A clean park with green grass, full recycling bins, and families picnicking.\nScene B: The same park with litter on the grass, overflowing bins, and no picnic blankets.",
  "fgm-055":
    "Scene A: A city square with a band playing, many people, and bright market stalls.\nScene B: The same square early in the morning with empty stalls and only a few walkers.",
  "fgm2-057":
    "Scene A: A shopping street with a bookshop, a bakery with a long queue, and a bus stop.\nScene B: The same street with the bookshop closed, no queue at the bakery, and a taxi rank.",
  "fgm3-057":
    "Scene A: A nature park with hikers on a forest trail, a canoe on the lake, and sunny weather.\nScene B: The same park with hikers in raincoats, no canoe, and dark clouds.",
};

/** Story outlines for speaking storytelling (replaces pictureSequence). */
const STORY_OUTLINES = {
  "sgm-043":
    "1. Tom and his family drive to the beach in a red car.\n2. They play on the sandy beach in the sunshine.\n3. Tom eats a big ice cream.\n4. They drive home tired but happy.",
  "sgm2-043":
    "1. Lily walks her dog to the park on a lead.\n2. They watch ducks on the pond.\n3. Lily buys an ice cream.\n4. They go home and the dog sleeps on the sofa.",
  "sgm3-043":
    "1. Ana and her dad buy train tickets at the station.\n2. They sit on the train and look out of the window.\n3. They eat sandwiches at a café during the journey.\n4. Ana buys a souvenir before they go home.",
  "mgm-051":
    "1. Anna is worried because her dog is missing.\n2. She searches the neighbourhood with her mum.\n3. They find the dog in the park near the trees.\n4. Anna hugs her dog and feels very happy.",
  "mgm2-051":
    "1. Tom realises his tablet is missing and looks worried.\n2. He searches his bag and asks his sister for help.\n3. They find the tablet in the school library.\n4. Tom smiles and thanks his sister.",
  "mgm3-051":
    "1. The beach is dirty with plastic bottles and paper.\n2. The children make a plan and bring gloves and bags.\n3. They work together to collect the rubbish.\n4. The beach is clean and the children celebrate.",
  "fgm-057":
    "1. The children find an old map in the attic.\n2. They explore a dark cave and feel nervous.\n3. They build a bridge to cross a river.\n4. They discover a treasure chest and celebrate.",
  "fgm2-059":
    "1. A family arrives at the community fair.\n2. They visit a hobby stall and try a craft activity.\n3. The youngest child gets lost for a short time.\n4. They find each other and leave the fair happy.",
  "fgm3-059":
    "1. A family arrives at a lakeside campsite.\n2. Heavy rain starts and everyone looks worried.\n3. They shelter in their tent and stay warm.\n4. The rain stops and they watch stars in the clear night sky.",
};

/** KET/PET speaking photo scenes (text-only). */
const KET_PET_SPEAKING_SCENES = {
  "kgm-059":
    "A group of teenagers are in a city park on a sunny afternoon. Some are sitting on benches talking, others are playing with a ball near a fountain.",
  "kgm2-059":
    "Travellers are waiting on a busy train platform. A train is arriving, people are checking timetables, and a family is carrying suitcases.",
  "kgm3-059":
    "Teenagers are at an outdoor concert. A band is playing on stage and the crowd is clapping and singing along.",
  "pgm-063":
    "Two friends are visiting a historic city. They are standing near an old bridge, taking photos, and reading a tourist map.",
  "pgm2-063":
    "People are exercising in an outdoor fitness area. Some are jogging, others are stretching near trees in a public park.",
  "pgm3-063":
    "Students are at an international cultural festival. They are watching a dance performance and trying food from different countries.",
};

function globalReplacements(content) {
  return content
    .replaceAll("Match the word to the picture.", "Match the word to the description.")
    .replaceAll(
      "Read the sentence. Choose the correct picture.",
      "Read the sentence. Choose the best answer."
    )
    .replaceAll(
      "Look at the two pictures. Tell your partner about the differences.",
      "Read the two scenes below. Tell your partner about the differences."
    )
    .replaceAll(
      "Look at the two pictures. Tell your partner about five differences between them.",
      "Read the two scenes below. Tell your partner about five differences between them."
    )
    .replaceAll("Look at the pictures and tell the story.", "Use the story outline and tell the story.")
    .replaceAll("Look at the picture. ", "Read the scene below. ")
    .replaceAll("Look at these pictures and tell the story of ", "Use the story outline to tell the story of ")
    .replaceAll("Look at these pictures and tell the story.", "Use the story outline and tell the story.")
    .replaceAll("Look at these two pictures of ", "Read the two descriptions of ")
    .replaceAll(
      "Talk about the picture and compare the two scenes.",
      "Read the scene description and describe what you see."
    )
    .replaceAll(
      "Describe the picture and say what the people are doing.",
      "Read the scene description and say what the people are doing."
    )
    .replaceAll(
      "Look at the photograph. Describe what you can see and say how the people might be feeling.",
      "Read the scene description. Describe what you can see and say how the people might be feeling."
    )
    .replaceAll(
      "Look at the photograph of a busy train station. Describe what you can see and say where the people might be going.",
      "Read the scene description. Describe what you can see and say where the people might be going."
    )
    .replaceAll(
      "Look at the photograph of teenagers at an outdoor concert. Describe what you can see and say how the people might be feeling.",
      "Read the scene description. Describe what you can see and say how the people might be feeling."
    )
    .replaceAll(
      "Describe the photograph and say what you think is happening.",
      "Read the scene description and say what you think is happening."
    )
    .replaceAll(
      "Look at the photograph. Describe the place and the people, and explain why they might be there.",
      "Read the scene description. Describe the place and the people, and explain why they might be there."
    )
    .replaceAll(
      "Look at the photograph. Describe the people, the place, and explain why they might be there.",
      "Read the scene description. Describe the people, the place, and explain why they might be there."
    )
    .replaceAll(
      "Look at the photograph. Describe the setting, the people, and what you think they are doing.",
      "Read the scene description. Describe the setting, the people, and what you think they are doing."
    )
    .replaceAll("Which picture shows this?", "Which option is correct?");
}

function removeImageOptions(content) {
  return content.replace(/\n\s*imageOptions:\s*\[[^\]]*\],?/g, "");
}

function removeImageUrlLines(content) {
  return content.replace(/\n\s*imageUrl:\s*"[^"]*",?/g, "");
}

function removePictureSequenceBlocks(content) {
  return content.replace(/\n\s*pictureSequence:\s*\[[^\]]*\],?/g, "");
}

function insertTaskDescriptionBeforeMaxDuration(block, taskDescription) {
  const escaped = taskDescription.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const multiline = taskDescription.includes("\n");
  const value = multiline
    ? "`" + taskDescription.replace(/`/g, "\\`") + "`"
    : `"${escaped}"`;

  if (block.includes("taskDescription:")) return block;

  return block.replace(
    /(\n\s*maxDurationSeconds:\s*\d+,)/,
    `\n    taskDescription: ${value},$1`
  );
}

function insertWritingTaskDescription(block, ref) {
  const scene = WRITING_SCENES[ref];
  if (!scene || block.includes("taskDescription:")) return block;

  const taskDesc = `Scene: ${scene}`;
  return block.replace(
    /(\n\s*maxWords:\s*\d+,)/,
    `$1\n    taskDescription: "${taskDesc.replace(/"/g, '\\"')}",`
  );
}

function processSpeakingBlocks(content) {
  const speakingBlockRe = /goldSpeaking\(\{[\s\S]*?\}\),/g;
  return content.replace(speakingBlockRe, (block) => {
    let next = block;
    const refMatch = block.match(/questionRef:\s*"([^"]+)"/);
    if (!refMatch) return next;
    const ref = refMatch[1];

    if (STORY_OUTLINES[ref]) {
      next = removePictureSequenceBlocks(next);
      const outline = STORY_OUTLINES[ref];
      if (!next.includes("taskDescription:")) {
        next = insertTaskDescriptionBeforeMaxDuration(
          next,
          `Story outline:\n${outline}`
        );
      }
    }

    if (SPEAKING_PAIR_SCENES[ref]) {
      next = removeImageUrlLines(next);
      if (!next.includes("taskDescription:")) {
        next = insertTaskDescriptionBeforeMaxDuration(next, SPEAKING_PAIR_SCENES[ref]);
      }
    }

    if (KET_PET_SPEAKING_SCENES[ref]) {
      next = removeImageUrlLines(next);
      if (!next.includes("taskDescription:")) {
        next = insertTaskDescriptionBeforeMaxDuration(
          next,
          `Scene: ${KET_PET_SPEAKING_SCENES[ref]}`
        );
      }
    }

    return next;
  });
}

function processWritingBlocks(content) {
  const writingBlockRe = /goldWriting\(\{[\s\S]*?\}\),/g;
  return content.replace(writingBlockRe, (block) => {
    let next = removeImageUrlLines(block);
    const refMatch = next.match(/questionRef:\s*"([^"]+)"/);
    if (!refMatch) return next;
    const ref = refMatch[1];
    return insertWritingTaskDescription(next, ref);
  });
}

function processSlotWritingSpeaking(content) {
  // starters-gold-mock-2/3 use slot builder with imageUrl on writing/speaking slots
  let next = content;
  next = next.replace(
    /(\n\s*kind:\s*"writing"[\s\S]*?)(\n\s*imageUrl:\s*"[^"]*",?)/g,
    (match, prefix) => {
      const refMatch = prefix.match(/ref:\s*"([^"]+)"/);
      if (!refMatch) return match.replace(/\n\s*imageUrl:\s*"[^"]*",?/, "");
      const ref = refMatch[1];
      const scene = WRITING_SCENES[ref];
      const withoutImage = match.replace(/\n\s*imageUrl:\s*"[^"]*",?/, "");
      if (!scene || withoutImage.includes("taskDescription:")) return withoutImage;
      return withoutImage.replace(
        /(\n\s*maxWords:\s*\d+,)/,
        `$1\n    taskDescription: "Scene: ${scene.replace(/"/g, '\\"')}",`
      );
    }
  );

  next = next.replace(
    /(\n\s*kind:\s*"speaking"[\s\S]*?)(\n\s*imageUrl:\s*"[^"]*",?)/g,
    (match, prefix) => {
      const refMatch = prefix.match(/ref:\s*"([^"]+)"/);
      if (!refMatch) return match.replace(/\n\s*imageUrl:\s*"[^"]*",?/, "");
      const ref = refMatch[1];
      const scene = SPEAKING_PAIR_SCENES[ref];
      const withoutImage = match.replace(/\n\s*imageUrl:\s*"[^"]*",?/, "");
      if (!scene || withoutImage.includes("taskDescription:")) return withoutImage;
      return withoutImage.replace(
        /(\n\s*maxDurationSeconds:\s*\d+,)/,
        `$1\n    taskDescription: "${scene.replace(/"/g, '\\"').replace(/\n/g, "\\n")}",`
      );
    }
  );

  next = next.replace(
    /(\n\s*kind:\s*"speaking"[\s\S]*?)(\n\s*pictureSequence:\s*\[[^\]]*\],?)/g,
    (match, prefix) => {
      const refMatch = prefix.match(/ref:\s*"([^"]+)"/);
      if (!refMatch) return match.replace(/\n\s*pictureSequence:\s*\[[^\]]*\],?/, "");
      const ref = refMatch[1];
      const outline = STORY_OUTLINES[ref];
      const withoutSeq = match.replace(/\n\s*pictureSequence:\s*\[[^\]]*\],?/, "");
      if (!outline || withoutSeq.includes("taskDescription:")) return withoutSeq;
      return withoutSeq.replace(
        /(\n\s*maxDurationSeconds:\s*\d+,)/,
        `$1\n    taskDescription: "Story outline:\\n${outline.replace(/"/g, '\\"')}",`
      );
    }
  );

  return next;
}

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const before = content;

  content = globalReplacements(content);
  content = removeImageOptions(content);
  content = processWritingBlocks(content);
  content = processSpeakingBlocks(content);
  content = processSlotWritingSpeaking(content);

  // Catch any remaining imageUrl / pictureSequence (KET/PET story writing, etc.)
  content = removeImageUrlLines(content);
  content = removePictureSequenceBlocks(content);

  if (content !== before) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${path.basename(filePath)}`);
  } else {
    console.log(`No changes ${path.basename(filePath)}`);
  }
}

const files = fs.readdirSync(MANIFESTS_DIR).filter((f) => f.endsWith(".ts"));
for (const file of files) {
  migrateFile(path.join(MANIFESTS_DIR, file));
}

console.log("Done.");
