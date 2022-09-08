import { firestore } from 'firebase-admin';

export default async function migrate(year: number): Promise<void> {
  const weeks = await firestore().doc(`votes/${year}`).listCollections();
  for (const week of weeks) {
    const userVotes = await week.get();
    for (const userVote of userVotes.docs) {
      const data = userVote.data();
      await data.votes
        .map((voted: string) => ({
          year: Number(year),
          week: Number(week.id),
          voter: firestore().doc(`profiles/${userVote.id}`),
          voted: firestore().doc(`profiles/${voted}`),
          timestamp: firestore.FieldValue.serverTimestamp(),
        }))
        .map(async (vote: any) => {
          await firestore()
            .collection(
              `years/${vote.year}/weeks/${
                vote.week < 10 ? `0${vote.week}` : vote.week
              }/votes`
            )
            .doc(`${vote.voter.id}:${vote.voted.id}`)
            .set(vote);
        });
    }
  }
}
