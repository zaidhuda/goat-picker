const useOptions = (options = [], votes = []) => {
  const optionVotes = votes
    .flatMap(({ votes }) => votes)
    .reduce((res, vote) => ({ ...res, [vote]: (res[vote] || 0) + 1 }), {});

  const optionsWithVotes = options.map((option) => ({
    ...option,
    votes: optionVotes[option.id],
  }));

  const voteSortedOptions = optionsWithVotes.sort((a, b) => b.votes - a.votes);

  const votedOptions = voteSortedOptions.filter(({ votes }) => votes);

  return {
    optionsWithVotes,
    optionVotes,
    votedOptions,
    voteSortedOptions,
  };
};

export default useOptions;
