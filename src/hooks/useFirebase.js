import { useContext } from 'react';
import { FirebaseContext } from '../contexts';

export default function useFirebase() {
  return useContext(FirebaseContext);
}
