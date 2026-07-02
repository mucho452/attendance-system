'use client';

import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useSearchParams } from 'next/navigation';

const firebaseConfig = {
    apiKey: "AIzaSyDStU4e3_ncsos4obCXpVAt4SaitfKSpk4",
    authDomain: "attendance-system-4194f.firebaseapp.com",
    projectId: "attendance-system-4194f",
    storageBucket: "attendance-system-4194f.firebasestorage.app",
    messagingSenderId: "775610185044",
    appId: "1:775610185044:web:e2b101da1258dc5b4ac4c1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
    const [subject, setSubject] = useState("授業名を読み込み中…");
    const [keyword, setKeyword] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [showError, setShowError] = useState(false);
    
    const searchParams = useSearchParams();
    const classId = searchParams.get('classId');

    useEffect(() => {
        async function loadClass() {
            if (!classId) return setSubject("授業IDがありません");
            try {
                const snap = await getDoc(doc(db, 'attendance', classId));
                if (snap.exists()) {
                    setSubject(snap.data().subject || "授業名なし");
                } else {
                    setSubject("授業が見つかりません");
                }
            } catch (e) {
                console.error(e);
            }
        }
        loadClass();
    }, [classId]);

    // 【重要】ここでキーワードをチェックする（Effectを使わない！）
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setKeyword(val);

        if (val === 'anankosen') {
            setIsConfirmed(true);
            setShowError(false);
        } else if (val.length >= 9) {
            setIsConfirmed(false);
            setShowError(true);
        } else {
            setIsConfirmed(false);
            setShowError(false);
        }
    };

    return (
        <div className="container">
            <h1>出席確認システム</h1>
            <div id="subjectName">{subject}</div>
            
            <div className="pass-section">
                <label htmlFor="keywordInput">学校の指定キーワードを入力してください</label>
                <input 
                    type="text" 
                    id="keywordInput" 
                    placeholder="キーワードを入力" 
                    value={keyword}
                    onChange={handleInputChange}
                    disabled={isConfirmed}
                />
                {showError && <p className="error-msg" style={{ display: 'block' }}>キーワードが違います</p>}
            </div>

            {isConfirmed && (
                <div style={{ display: 'block', marginTop: '20px' }}>
                    <p>操作を選択してください</p>
                    <a href={`/register?classId=${classId}`} className="btn btn-register">会員登録</a>
                    <a href={`/login?classId=${classId}`} className="btn btn-login">ログイン</a>
                    <a href={`/delete?classId=${classId}`} className="btn btn-delete">アカウント削除</a>
                </div>
            )}
        </div>
    );
}