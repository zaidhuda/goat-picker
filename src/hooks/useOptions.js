const useOptions = (options = [], votes = []) => {
  const optionVotes = votes
    .flatMap(({ votes }) => votes)
    .reduce((res, vote) => ({ ...res, [vote]: (res[vote] || 0) + 1 }), {});

  const voteSortedOptions = options.sort((a, b) => b.votes - a.votes);

  const optionsWithVotes = voteSortedOptions.map((option) => ({
    ...option,
    votes: optionVotes[option.id],
  }));

  const votedOptions = optionsWithVotes.filter(({ votes }) => votes);

  return {
    optionsWithVotes,
    optionVotes,
    votedOptions,
    voteSortedOptions,
  };
};

export default useOptions;
