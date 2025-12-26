import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

export default function RewardCard() {
    const [ coupon, setCoupon ] = useState("xyz-xyz-123");
  return (
    <View>
        <View>
            <View>
                <Text>USERxNAME</Text>
                <Text>process</Text>
            </View>
            <View>
                <Text>Amount</Text>
                <Text>5000 /-</Text>
            </View>
        </View>
        {
            coupon ? 
            <View>
                <Text>{coupon}</Text>
                <TouchableOpacity>C</TouchableOpacity>
            </View> : 
            <></>
        }
    </View>
  )
}