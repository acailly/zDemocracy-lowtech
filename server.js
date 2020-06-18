const path = require('path')

const express = require("express");
const ejs = require("ejs");

const folderCopy = require('./utils-file/folderCopy')
const folderNew = require('./utils-file/folderNew')
const folderFileList = require('./utils-file/folderFileList')
const fileWriteContent = require('./utils-file/fileWriteContent')
const fileReadExtension = require('./utils-file/fileReadExtension')
const fileWriteExtension = require('./utils-file/fileWriteExtension')
const fileReadContent = require('./utils-file/fileReadContent')
const extensionWithoutDot = require('./utils-file/extensionWithoutDot')

const pollsFolder = path.join(__dirname, "data", "polls")
const templatesFolder = path.join(__dirname, "data", "templates")


var app = express();
app.use(express.urlencoded({ extended: true }));

// from https://stackoverflow.com/questions/27383222/is-there-a-way-to-keep-the-file-extension-of-ejs-file-as-html
app.engine(".html", ejs.__express);

app.get("/", function (req, res) {
  res.render("index.html", { polls: polls });
});

app.get("/polls", function (req, res) {
  res.render("polls.html", { polls: polls });
});

app.post("/new", function (req, res) {
  const pollId = new Date().getTime().toString();
  folderCopy(
    path.join(templatesFolder, "poll"),
    path.join(pollsFolder, pollId),
  )

  const pollTitle = req.body.title;
  fileWriteContent(
    path.join(pollsFolder, pollId, "title.txt"),
    pollTitle
  )

  fileWriteExtension(
    path.join(pollsFolder, pollId),
    "status",
    "draft"
  )

  folderNew(
    path.join(pollsFolder, pollId, "options")
  )

  folderCopy(
    path.join(templatesFolder, "jugement-majoritaire", "grades"),
    path.join(pollsFolder, pollId, "grades")
  )

  folderNew(
    path.join(pollsFolder, pollId, "votes")
  )

  res.redirect(302, `/polls/${pollId}/options`);
});

app.get("/polls/:id/options", function (req, res) {
  const pollId = req.params.id

  const pollTitle = fileReadContent(
    path.join(pollsFolder, pollId, "title.txt")
  )

  const optionsFiles = folderFileList(
    path.join(pollsFolder, pollId, "options")
  )
  const pollOptions = optionsFiles.map(optionFile => {
    return fileReadContent(optionFile)
  })

  res.render("options.html", { pollId, pollTitle, pollOptions });
});

app.post("/polls/:id/add-option", function (req, res) {
  const pollId = req.params.id

  const optionName = req.body.option;
  
  const optionsFiles = folderFileList(
    path.join(pollsFolder, pollId, "options")
  )
  const optionCount = optionsFiles.length
  const optionPosition = optionCount + 1
  const optionId = optionPosition

  const optionFilename = `${optionPosition}.${optionId}`

  fileWriteContent(
    path.join(pollsFolder, pollId, "options", optionFilename),
    optionName
  )
  
  res.redirect(302, `/polls/${pollId}/options`);
});

app.post("/polls/:id/publish", function (req, res) {
  const pollId = req.params.id

  fileWriteExtension(
    path.join(pollsFolder, pollId), 
    "status",
    "open"
  )
  
  res.redirect(302, `/polls/${pollId}/published`);
});

app.get("/polls/:id/published", function (req, res) {
  const pollId = req.params.id

  const pollTitle = fileReadContent(
    path.join(pollsFolder, pollId, "title.txt")
  )

  const optionsFiles = folderFileList(
    path.join(pollsFolder, pollId, "options")
  )
  const pollOptions = optionsFiles.map(optionFile => {
    return fileReadContent(optionFile)
  })
  
  res.render("published.html", { pollId, pollTitle, pollOptions });
});

app.get("/polls/:id/vote", function (req, res) {
  const pollId = req.params.id

  const pollTitle = fileReadContent(
    path.join(pollsFolder, pollId, "title.txt")
  )

  const optionsFiles = folderFileList(
    path.join(pollsFolder, pollId, "options")
  )
  const pollOptions = optionsFiles.map(optionFile => {
    return fileReadContent(optionFile)
  })

  const gradesFiles = folderFileList(
    path.join(pollsFolder, pollId, "grades")
  )
  const pollGrades = gradesFiles.map(gradeFile => {
    const gradeName = fileReadContent(gradeFile)
    const gradeValue = extensionWithoutDot(gradeFile)
    return {name: gradeName, value: gradeValue}
  })

  res.render("vote.html", { pollId, pollTitle, pollOptions, pollGrades });
});

app.post("/polls/:id/validate-vote", function (req, res) {
  const pollId = req.params.id
  
  const name = req.body.name;
  
  const optionsFiles = folderFileList(
    path.join(pollsFolder, pollId, "options")
  )
  const pollOptionsIds = optionsFiles.map(optionFile => {
    return extensionWithoutDot(optionFile)
  })

  folderNew(
    path.join(pollsFolder, pollId, "votes", name)
  )

  pollOptionsIds.map((optionId, optionIndex) => {
    const optionAnswer = req.body[`option_${optionIndex}`];
    fileWriteContent(
      path.join(pollsFolder, pollId, "votes", name, `${optionId}.${optionAnswer}`),
      ""
    )
  });

  res.redirect(302, `/polls/${pollId}/voted`);
});

app.get("/polls/:id/voted", function (req, res) {
  const pollId = req.params.id

  const pollTitle = fileReadContent(
    path.join(pollsFolder, pollId, "title.txt")
  )

  const votersFolders = folderFileList(
    path.join(pollsFolder, pollId, "votes")
  )
  const pollVoters = votersFolders.map(voterFolder => {
    return path.basename(voterFolder);
  })

  res.render("voted.html", { pollId, pollTitle, pollVoters });
});

app.post("/polls/:id/close", function (req, res) {
  const pollId = req.params.id

  const gradesFiles = folderFileList(
    path.join(pollsFolder, pollId, "grades")
  )
  const pollGradesValues = gradesFiles.map(gradeFile => {
    const gradeValue = extensionWithoutDot(gradeFile)
    return gradeValue
  })

  const optionsFiles = folderFileList(
    path.join(pollsFolder, pollId, "options")
  )
  const pollOptionsIds = optionsFiles.map(optionFile => {
    return extensionWithoutDot(optionFile)
  })

  const votersFolders = folderFileList(
    path.join(pollsFolder, pollId, "votes")
  )
  const pollVoters = votersFolders.map(voterFolder => {
    return path.basename(voterFolder);
  })

  folderNew(
    path.join(pollsFolder, pollId, "results")
  )

  pollOptionsIds.map((optionId) => {

    folderNew(
      path.join(pollsFolder, pollId, "results", optionId)
    )
        
    const voteCount = pollVoters.length;

    const voteCountByGrade = pollGradesValues.map(() => 0);
    pollVoters.forEach((pollVoter) => {
      const voterAnswer = fileReadExtension(
        path.join(pollsFolder, pollId, "votes", pollVoter),
        optionId
      )
      
      const gradeIndex = pollGradesValues.findIndex((gradeValue) => gradeValue === voterAnswer);
      voteCountByGrade[gradeIndex]++;
    });    

    let optionScore = 0;
    let optionGradeValue;
    for (let gradeIndex = pollGradesValues.length - 1; gradeIndex >= 0; gradeIndex--) {
      optionGradeValue = pollGradesValues[gradeIndex];
      optionScore += voteCountByGrade[gradeIndex];
      if (optionScore > voteCount / 2) {
        break;
      }
    }

    fileWriteContent(
      path.join(pollsFolder, pollId, "results", optionId, `score.${optionScore}`),
      ""
    )

    fileWriteContent(
      path.join(pollsFolder, pollId, "results", optionId, `grade.${optionGradeValue}`),
      ""
    )

    folderNew(
      path.join(pollsFolder, pollId, "results", optionId, "by-grade")
    )

    pollGradesValues.forEach((pollGradeValue, pollGradeIndex) => {
      const voteCountForCurrentGrade = voteCountByGrade[pollGradeIndex]

      fileWriteContent(
        path.join(
          pollsFolder, pollId, "results", optionId, "by-grade", 
          `${pollGradeValue}.${voteCountByGrade}`
        ), ""
      )
    })
  });

  let winnerOptionId;
  for (let gradeIndex = 0; gradeIndex < pollGradesValues.length; gradeIndex++) {
    const gradeValue = pollGradesValues[gradeIndex];
    const optionIndexesWithMatchingGrade = pollOptionsIds
      .map((pollOptionId, pollOptionIndex) => {
        const optionResultGradeValue = fileReadExtension(
          path.join(pollsFolder, pollId, "results", pollOptionId), 
          "grade"
        )

        const optionResultScore = fileReadExtension(
          path.join(pollsFolder, pollId, "results", pollOptionId), 
          "score"
        )

        if (optionResultGradeValue === gradeValue) {
          return {
            optionIndex: pollOptionIndex,
            optionScore: optionResultScore,
          };
        }
        return undefined;
      })
      .filter(v => v !== undefined);
    if (optionIndexesWithMatchingGrade.length > 0) {
      const sortedOptionIndexesWithMatchingGrade = optionIndexesWithMatchingGrade.sort(
        (a, b) => {
          return b.score - a.score;
        }
      );
      const winnerOptionIndex =
        sortedOptionIndexesWithMatchingGrade[0].optionIndex;
      winnerOptionId = pollOptionsIds[winnerOptionIndex];
      break;
    }
  }

  fileWriteContent(
    path.join(pollsFolder, pollId, "results", `winner.${winnerOptionId}`),
    ""
  )

  fileWriteExtension(
    path.join(pollsFolder, pollId),
    "status",
    "close"
  )

  res.redirect(302, `/polls/${pollId}/results`);
});

app.get("/polls/:id/results", function (req, res) {
  const poll = polls.find((p) => p.id === req.params.id);
  res.render("results.html", { poll });
});

app.use(function (req, res, next) {
  res.status(404).render("404.html");
});

app.listen(8080);


// TODO A SUPPRIMER
var polls = [
  {
    id: "aaa",
    title: "Est ce qu'on prend un chien ?",
    status: "open",
    options: ["oui", "non"],
    // From absolute Yes to absolute No
    grades: [
      {
        name: "Oui",
        value: "oui",
      },
      {
        name: "Pourquoi pas",
        value: "pourquoipas",
      },
      {
        name: "Bof",
        value: "bof",
      },
      {
        name: "Non",
        value: "non",
      },
    ],
    votes: [
      {
        name: "Riri",
        answers: ["pourquoipas", "non"],
      },
      {
        name: "Fifi",
        answers: ["oui", "bof"],
      },
    ],
  },
  {
    id: "bbb",
    title: "Qui va sortir les poubelles ?",
    status: "open",
    options: ["Alice", "Bob"],
    // From absolute Yes to absolute No
    grades: [
      {
        name: "Oui",
        value: "oui",
      },
      {
        name: "Pourquoi pas",
        value: "pourquoipas",
      },
      {
        name: "Bof",
        value: "bof",
      },
      {
        name: "Non",
        value: "non",
      },
    ],
    votes: [
      {
        name: "Riri",
        answers: ["pourquoipas", "non"],
      },
      {
        name: "Fifi",
        answers: ["oui", "bof"],
      },
    ],
  },
  {
    id: "ccc",
    title: "La meilleure série du moment ?",
    status: "open",
    options: ["Casa de papel", "Game of thrones"],
    // From absolute Yes to absolute No
    grades: [
      {
        name: "Oui",
        value: "oui",
      },
      {
        name: "Pourquoi pas",
        value: "pourquoipas",
      },
      {
        name: "Bof",
        value: "bof",
      },
      {
        name: "Non",
        value: "non",
      },
    ],
    votes: [
      {
        name: "Riri",
        answers: ["pourquoipas", "non"],
      },
      {
        name: "Fifi",
        answers: ["oui", "bof"],
      },
    ],
  },
  {
    id: "ddd",
    title: "De quelle couleur on repeint la chambre ?",
    status: "close",
    options: ["Bleu", "Rouge"],
    // From absolute Yes to absolute No
    grades: [
      {
        name: "Oui",
        value: "oui",
      },
      {
        name: "Pourquoi pas",
        value: "pourquoipas",
      },
      {
        name: "Bof",
        value: "bof",
      },
      {
        name: "Non",
        value: "non",
      },
    ],
    votes: [
      {
        name: "Riri",
        answers: ["pourquoipas", "non"],
      },
      {
        name: "Fifi",
        answers: ["oui", "bof"],
      },
    ],
    optionResults: [
      {
        grade: { name: "Oui", value: "oui" },
        score: 1,
        voteCountByGrade: [1, 1, 1, 1],
      },
      {
        grade: { name: "Bof", value: "bof" },
        score: 1,
        voteCountByGrade: [1, 1, 1, 1],
      },
    ],
    winnerOption: "Bleu",
  },
  {
    id: "eee",
    title: "Quand est ce qu'on prend l'apéro ?",
    status: "close",
    options: ["Maintenant", "Tout de suite"],
    // From absolute Yes to absolute No
    grades: [
      {
        name: "Oui",
        value: "oui",
      },
      {
        name: "Pourquoi pas",
        value: "pourquoipas",
      },
      {
        name: "Bof",
        value: "bof",
      },
      {
        name: "Non",
        value: "non",
      },
    ],
    votes: [
      {
        name: "Riri",
        answers: ["pourquoipas", "non"],
      },
      {
        name: "Fifi",
        answers: ["oui", "bof"],
      },
    ],
    optionResults: [
      {
        grade: { name: "Oui", value: "oui" },
        score: 1,
        voteCountByGrade: [1, 1, 1, 1],
      },
      {
        grade: { name: "Bof", value: "bof" },
        score: 1,
        voteCountByGrade: [1, 1, 1, 1],
      },
    ],
    winnerOption: "Maintenant",
  },
];