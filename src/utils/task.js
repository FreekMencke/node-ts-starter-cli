import ora from 'ora';

export const task = (() => {
  const spinner = ora(); // put spinner instance in closure to reuse it

  /**
   * The task function is a wrapper that will start a spinner, run a task and
   * stop the spinner with a success message if the task resolves or with an
   * error message if the task rejects.
   *
   * @param {string} msgStart
   * @param {string} msgSuccess
   * @param {(ora: import('ora').Ora) => Promise<T>} taskPromise
   * @returns {Promise<T>}
   */
  return async (msgStart, msgSuccess, taskPromise) => {
    spinner.start(msgStart);
    try {
      await taskPromise(spinner);
      if (msgSuccess) spinner.succeed(msgSuccess);
    } catch (err) {
      spinner.fail(err.message);
      throw err;
    }
  };
})();
