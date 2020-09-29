import React from 'react';
import MemberLayout from "../../layouts/MemberLayout";
import Messenger from "../../component/Chat/Messenger";

export default function Home() {
    return (
        <MemberLayout>
            <Messenger/>
        </MemberLayout>
    );
}