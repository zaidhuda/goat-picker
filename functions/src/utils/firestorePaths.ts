export default function votesPath(year: number, week: number): string {
  return `years/${year}/weeks/${week < 10 ? `0${week}` : week}/votes`;
}
