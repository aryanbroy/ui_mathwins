import { createDailySession } from '@/lib/api/dailyTournament';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function TournamentScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [questionExpression, setQuestionExpression] = useState<string | null>(
    null
  );

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setErr(null);
      setErrMsg(null);
      try {
        const createSession = await createDailySession();
        console.log('Session created: ', createSession);
        const data = createSession.data;
        const { question } = data;
        setQuestionExpression(question.expression);
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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />

        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  if (err != null) {
    return (
      <View>
        <Text>Error fetching attempts: {errMsg}</Text>
      </View>
    );
  }
  return (
    <View>
      <Text>{questionExpression}</Text>
      <Text>Submit</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
