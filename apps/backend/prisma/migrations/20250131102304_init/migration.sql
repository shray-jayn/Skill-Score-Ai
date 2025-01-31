-- CreateTable
CREATE TABLE "CoachingNumbers" (
    "id" TEXT NOT NULL,
    "coachingRoundId" UUID,
    "round" INTEGER,
    "coachingStyle" TEXT,
    "count" INTEGER,
    "percentage" DOUBLE PRECISION,
    "styleNumber" INTEGER,
    "styleExplanation" TEXT,
    "coachingSessionId" UUID,

    CONSTRAINT "CoachingNumbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingRoundFeedback" (
    "id" TEXT NOT NULL,
    "coachingRoundId" UUID,
    "round" INTEGER,
    "feedbackImprovements" TEXT,
    "detailedAnalysis" TEXT,
    "sectionNo" INTEGER,

    CONSTRAINT "CoachingRoundFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingSessions" (
    "coachingRoundId" UUID NOT NULL,
    "coachingSessionId" UUID NOT NULL,
    "coachingSessionName" VARCHAR NOT NULL,
    "coacheeName1" VARCHAR,
    "round" INTEGER,
    "coacheeName2" VARCHAR,
    "coacheeName3" VARCHAR,
    "teamName" VARCHAR,
    "date" TIMESTAMP(3),
    "userId" UUID,
    "coacheeName" VARCHAR,

    CONSTRAINT "CoachingSessions_pkey" PRIMARY KEY ("coachingRoundId")
);

-- CreateTable
CREATE TABLE "CoachingStyleFeedback" (
    "id" TEXT NOT NULL,
    "coachingRoundId" UUID,
    "round" INTEGER,
    "coachingStyle" TEXT,
    "styleNumber" INTEGER,
    "styleExplanation" TEXT,

    CONSTRAINT "CoachingStyleFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingStyleResults" (
    "id" TEXT NOT NULL,
    "paragraphId" UUID NOT NULL,
    "coachingRoundId" UUID,
    "coachingStyle" VARCHAR,
    "transcribedText" TEXT,
    "round" INTEGER,

    CONSTRAINT "CoachingStyleResults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingStyleTimechart" (
    "id" TEXT NOT NULL,
    "coachingRoundId" UUID,
    "round" INTEGER,
    "coachingStyle" TEXT,
    "section" INTEGER,
    "coachingSessionId" UUID,

    CONSTRAINT "CoachingStyleTimechart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextChecking" (
    "coachingRoundId" UUID NOT NULL,
    "coachingSessionId" UUID NOT NULL,
    "text" TEXT,

    CONSTRAINT "TextChecking_pkey" PRIMARY KEY ("coachingRoundId","coachingSessionId")
);

-- CreateTable
CREATE TABLE "TranscriptionRaw" (
    "paragraphId" UUID NOT NULL,
    "coachingRoundId" UUID,
    "speakerId" VARCHAR,
    "transcribedText" TEXT,
    "round" INTEGER,

    CONSTRAINT "TranscriptionRaw_pkey" PRIMARY KEY ("paragraphId")
);

-- CreateTable
CREATE TABLE "UserData" (
    "userId" UUID NOT NULL,
    "email" VARCHAR,
    "password" VARCHAR,
    "designation" VARCHAR,
    "name" VARCHAR,
    "image" VARCHAR,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserData_email_key" ON "UserData"("email");

-- AddForeignKey
ALTER TABLE "CoachingNumbers" ADD CONSTRAINT "CoachingNumbers_coachingRoundId_fkey" FOREIGN KEY ("coachingRoundId") REFERENCES "CoachingSessions"("coachingRoundId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingRoundFeedback" ADD CONSTRAINT "CoachingRoundFeedback_coachingRoundId_fkey" FOREIGN KEY ("coachingRoundId") REFERENCES "CoachingSessions"("coachingRoundId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingStyleFeedback" ADD CONSTRAINT "CoachingStyleFeedback_coachingRoundId_fkey" FOREIGN KEY ("coachingRoundId") REFERENCES "CoachingSessions"("coachingRoundId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingStyleResults" ADD CONSTRAINT "CoachingStyleResults_paragraphId_fkey" FOREIGN KEY ("paragraphId") REFERENCES "TranscriptionRaw"("paragraphId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingStyleTimechart" ADD CONSTRAINT "CoachingStyleTimechart_coachingRoundId_fkey" FOREIGN KEY ("coachingRoundId") REFERENCES "CoachingSessions"("coachingRoundId") ON DELETE SET NULL ON UPDATE CASCADE;
