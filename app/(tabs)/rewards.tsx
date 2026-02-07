import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { useAuth } from '@/context/authContext'
import UserRewardScreen from '@/components/Reward/UserRewardScreen';
import AdminRewardScreen from '@/components/Reward/AdminRewardScreen';
import RewardHistoryScreen from '../rewardHistory';

export default function Rewards(){
  const {user} = useAuth();
  return (
      <View style={{ flex: 1 }}>
        {user?.isAdmin ?
        <AdminRewardScreen /> :
        <UserRewardScreen />
        }
        {/* <RewardHistoryScreen/> */}
      </View>
    )
}
