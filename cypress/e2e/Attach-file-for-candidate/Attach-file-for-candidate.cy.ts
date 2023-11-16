import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import Admin from "../e2ePageObjects/Admin-page";
import PIM from "../e2ePageObjects/PIM-page";
import Recruitment from "../e2ePageObjects/Recruitment-page";
import Logger from "../../support/Helpers/login-logout-helper";

const AdminPage = new Admin();
const PIMpage = new PIM();
const RecruitmentPage = new Recruitment();
const logger = new Logger();

const HRMOrangeURLs = {
  LOGIN_PAGE: "",
};

const ADMIN_INFO = {
  USERNAME: "admin",
  PASSWORD: "admin123",
};

const CANDIDATE_STATUS = {
  SCHEDULED: "Interview Scheduled",
  PASSED: "Interview Passed",
  FAILED: "Interview Failed",
};

let employeeId: number;
let jobTitleId: number;
let addedCandidatePageUrl: string;

cy.visit(HRMOrangeURLs.LOGIN_PAGE);
logger.passedLogin(ADMIN_INFO.USERNAME, ADMIN_INFO.PASSWORD);

cy.fixture("employee").as("employee");
cy.fixture("jobTitle").as("jobTitle");
cy.fixture("vacancy").as("vacancy");
cy.fixture("candidate").as("candidate");

// part 2: test case 1
Given("The system have employee And job title And vacancy", () => {
  cy.get("@employee").then((employee) => {
    PIMpage.createEmployeeViaAPI(employee).then((response) => {
      employeeId = response.data.empNumber;
      PIMpage.createEmployeeWithLoginInfoViaAPI(employee, employeeId);
    });
  });

  cy.get("@jobTitle").then((jobTitle) => {
    AdminPage.createJobTitleViaAPI(jobTitle).then((response) => {
      jobTitleId = response.data.id;
    });
  });

  cy.get("@vacancy").then((vacancy) => {
    RecruitmentPage.addVacancy(vacancy, jobTitleId, employeeId);
  });

  cy.get("@candidate").then((candidate) => {
    RecruitmentPage.openAddCandidatePage();
    RecruitmentPage.addCandidateViaUI(candidate).then((url) => {
      addedCandidatePageUrl = url;
    });
    RecruitmentPage.shortListInitiatedCandidate();
    RecruitmentPage.scheduleInterviewForCandidate();
  });
});

Given('The system have candidate with status "Interview Scheduled"', () => {
  RecruitmentPage.assertTheCurrentStatus(CANDIDATE_STATUS.SCHEDULED);
});

When("The Admin log in", () => {
  logger.passedLogin(ADMIN_INFO.USERNAME, ADMIN_INFO.PASSWORD);
});

When("Access the candidate form and Enable the edit candidate switch", () => {
  RecruitmentPage.open();
  RecruitmentPage.openAddedCandidatePage(addedCandidatePageUrl);
  RecruitmentPage.enableEditCandidate();
});

When("Upload a txt file in resume section and save the form", () => {
  RecruitmentPage.editCandidateProfileToAttachFile("file.txt");
});

When("Download the resume txt file", () => {
  RecruitmentPage.downloadAttachedFile();
});

Then("Verify the downloaded file content match the uploaded txt file", () => {
  RecruitmentPage.assertAttachedFileContent(
    "../../fixture/file.txt",
    "/Users/mbp/Downloads/file.txt"
  );
});

// part 2: test case 2
Given("The system have employee And job title And vacancy", () => {
  cy.get("@employee").then((employee) => {
    PIMpage.createEmployeeViaAPI(employee).then((response) => {
      employeeId = response.data.empNumber;
      PIMpage.createEmployeeWithLoginInfoViaAPI(employee, employeeId);
    });
  });

  cy.get("@jobTitle").then((jobTitle) => {
    AdminPage.createJobTitleViaAPI(jobTitle).then((response) => {
      jobTitleId = response.data.id;
    });
  });

  cy.get("@vacancy").then((vacancy) => {
    RecruitmentPage.addVacancy(vacancy, jobTitleId, employeeId);
  });

  cy.get("@candidate").then((candidate) => {
    RecruitmentPage.openAddCandidatePage();
    RecruitmentPage.addCandidateViaUI(candidate).then((url) => {
      addedCandidatePageUrl = url;
    });
    RecruitmentPage.shortListInitiatedCandidate();
    RecruitmentPage.scheduleInterviewForCandidate();
  });
});

Given('The system have candidate with status "Interview Scheduled"', () => {
  RecruitmentPage.assertTheCurrentStatus(CANDIDATE_STATUS.SCHEDULED);
});

When("The Admin log in", () => {
  logger.passedLogin(ADMIN_INFO.USERNAME, ADMIN_INFO.PASSWORD);
});

When("Access the candidate form and Enable the edit candidate switch", () => {
  RecruitmentPage.open();
  RecruitmentPage.openAddCandidatePage();
  RecruitmentPage.enableEditCandidate();
});

When("Upload a txt file in resume section and save the form", () => {
  RecruitmentPage.editCandidateProfileToAttachFile("file.txt");
});

When("Download the resume txt file", () => {
  RecruitmentPage.downloadAttachedFile();
});

Then("Verify the downloaded file content match the uploaded txt file", () => {
  RecruitmentPage.assertAttachedFileContent(
    "/Users/mbp/Desktop/FinalProjectQAwithGSG/cypress/fixtures/file.txt",
    "Users/mbp/Download/file.txt"
  );
});
