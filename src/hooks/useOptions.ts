import { Profile } from 'types/profile';
import { UserVote } from 'types/vote';

const useOptions = (options: Profile[] = [], allVotes: UserVote[] = []) => {
  const optionVotes = allVotes
    .flatMap(({ votes = [] }) => votes)
    .reduce<{ [key in string]: number }>(
      (res, vote) => ({ ...res, [vote]: (res[vote] || 0) + 1 }),
      {}
    );

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
