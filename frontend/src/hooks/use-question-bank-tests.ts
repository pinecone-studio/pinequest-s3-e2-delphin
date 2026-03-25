import { useSyncExternalStore } from "react";
import { type MockTest } from "@/lib/mock-data";
import { questionBankTests as defaultQuestionBankTests } from "@/lib/question-bank-data";

const QUESTION_BANK_TESTS_EVENT = "question-bank-tests-change";
const QUESTION_BANK_TESTS_KEY = "questionBankTests";

let cachedQuestionBankTests = defaultQuestionBankTests;
let cachedSerializedQuestionBankTests = JSON.stringify(defaultQuestionBankTests);

function readQuestionBankTests(): MockTest[] {
  const storedTests = localStorage.getItem(QUESTION_BANK_TESTS_KEY);
  if (!storedTests) {
    return defaultQuestionBankTests;
  }

  try {
    const parsedTests = JSON.parse(storedTests) as MockTest[];
    return Array.isArray(parsedTests) ? parsedTests : defaultQuestionBankTests;
  } catch {
    return defaultQuestionBankTests;
  }
}

function getQuestionBankTestsSnapshot() {
  if (typeof window === "undefined") {
    return defaultQuestionBankTests;
  }

  const nextTests = readQuestionBankTests();
  const nextSerializedTests = JSON.stringify(nextTests);

  if (nextSerializedTests !== cachedSerializedQuestionBankTests) {
    cachedQuestionBankTests = nextTests;
    cachedSerializedQuestionBankTests = nextSerializedTests;
  }

  return cachedQuestionBankTests;
}

function subscribeToQuestionBankTests(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(QUESTION_BANK_TESTS_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(QUESTION_BANK_TESTS_EVENT, onStoreChange);
  };
}

export function saveQuestionBankTests(tests: MockTest[]) {
  if (typeof window === "undefined") {
    return;
  }

  cachedQuestionBankTests = tests;
  cachedSerializedQuestionBankTests = JSON.stringify(tests);
  localStorage.setItem(QUESTION_BANK_TESTS_KEY, cachedSerializedQuestionBankTests);
  window.dispatchEvent(new Event(QUESTION_BANK_TESTS_EVENT));
}

export function useQuestionBankTests() {
  return useSyncExternalStore(
    subscribeToQuestionBankTests,
    getQuestionBankTestsSnapshot,
    () => defaultQuestionBankTests,
  );
}
