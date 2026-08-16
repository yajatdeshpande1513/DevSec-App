// Deliberately triggers eslint-plugin-security's detect-eval-with-expression
// rule for demo purposes. Never imported or called anywhere in the app.
export function demoOnlyUnusedFunction(userInput) {
  return eval(userInput);
}
