import React from 'react';
import { CircularProgress } from '@material-ui/core';

export default function Loader() {
  return (
    <div className="flex items-center justify-center p-8">
      <CircularProgress />
    </div>
  );
}
