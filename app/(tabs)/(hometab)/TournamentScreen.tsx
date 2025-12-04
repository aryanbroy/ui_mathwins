import { createDailySession } from '@/lib/api/dailyTournament';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function TournamentScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState(null);
  const [errMsg, setErrMsg] = useState('internal server error');

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const createSession = await createDailySession();
        console.log('Session created: ', createSession);
      } catch (err: any) {
        if (err instanceof AxiosError) {
          console.log('AxiosError: ', err);
          setErrMsg(err.response?.data.message);
        } else {
          console.log('Error: ', err);
        }
        setErr(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (err != null) {
    return (
      <View>
        <Text>Error fetching attempts: {errMsg}</Text>
      </View>
    );
  }
  return (
    <View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text>Question 1</Text>
          <Text>Question 2</Text>
        </>
      )}
    </View>
  );
}
