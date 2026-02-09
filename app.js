const teamData = {
    A: {
        protagonist: {
            type: '사람',
            origin: '한국',
            age: '9살',
            personality: '장난꾸러기'
        },
        keywords: ['학교', '다툼', '화가났음', '금식', '친구']
    },
    B: {
        protagonist: {
            type: '동물',
            origin: '고양이',
            age: '아기',
            personality: '호기심 많음'
        },
        keywords: ['쥐', '늘잠', '숲은', '친구', '아빠']
    }
};

async function generateStory(team) {
    const apiKey = document.getElementById('apiKey').value.trim();
    
    if (!apiKey) {
        showError('API 키를 입력해주세요.');
        return;
    }

    if (!apiKey.startsWith('sk-ant-')) {
        showError('올바른 Anthropic API 키를 입력해주세요. (sk-ant-로 시작해야 합니다)');
        return;
    }

    const data = teamData[team];
    const loading = document.getElementById('loading');
    const storyOutput = document.getElementById('storyOutput');
    const errorMessage = document.getElementById('errorMessage');
    
    loading.style.display = 'block';
    storyOutput.style.display = 'none';
    errorMessage.style.display = 'none';

    // Disable buttons
    document.querySelectorAll('button').forEach(btn => btn.disabled = true);

    try {
        // Generate story text
        const storyPrompt = `당신은 창의적인 동화 작가입니다. 다음 조건에 맞는 어린이 동화를 작성해주세요:

주인공 설정:
- 종류: ${data.protagonist.type}
- ${data.protagonist.type === '사람' ? '나라' : '동물 종류'}: ${data.protagonist.origin}
- 나이: ${data.protagonist.age}
- 성격: ${data.protagonist.personality}

필수로 포함해야 할 키워드 (반드시 모두 사용): ${data.keywords.join(', ')}

요구사항:
1. A4 1~2장 분량의 동화를 작성하세요 (약 1000-1500자)
2. 위의 5개 키워드를 반드시 모두 자연스럽게 스토리에 녹여내세요
3. 어린이가 이해하기 쉬운 표현을 사용하세요
4. 교훈적이고 따뜻한 이야기로 만들어주세요
5. 주인공에게 이름을 지어주세요
6. 이야기의 시작, 전개, 결말이 명확해야 합니다

동화만 작성해주세요. 다른 설명은 필요없습니다.`;

        const storyResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 2500,
                messages: [{
                    role: 'user',
                    content: storyPrompt
                }]
            })
        });

        if (!storyResponse.ok) {
            const errorData = await storyResponse.json().catch(() => ({}));
            throw new Error(errorData.error?.message || '동화 생성에 실패했습니다. API 키를 확인해주세요.');
        }

        const storyData = await storyResponse.json();
        const storyText = storyData.content[0].text;

        // Generate illustration descriptions
        const illustrations = await generateIllustrations(apiKey, storyText, team);

        displayStory(team, data.keywords, storyText, illustrations);

    } catch (error) {
        console.error('Error:', error);
        showError('오류가 발생했습니다: ' + error.message);
    } finally {
        loading.style.display = 'none';
        document.querySelectorAll('button').forEach(btn => btn.disabled = false);
    }
}

async function generateIllustrations(apiKey, storyText, team) {
    const illustrations = [];
    
    // Generate 2 illustration descriptions
    for (let i = 1; i <= 2; i++) {
        const illustrationPrompt = `다음 동화의 ${i === 1 ? '시작 부분(처음 1/3)' : '마지막 부분(마지막 1/3)'}을 표현하는 삽화에 대한 간단한 설명을 한 문장으로 작성해주세요.

동화:
${storyText}

${i === 1 ? '이야기의 처음 부분 장면' : '이야기의 결말 부분 장면'}을 묘사하는 한 문장을 작성해주세요. 설명만 간단히 해주세요.`;

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 200,
                    messages: [{
                        role: 'user',
                        content: illustrationPrompt
                    }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const description = data.content[0].text.trim();
                illustrations.push({
                    caption: `삽화 ${i}: ${description}`
                });
            } else {
                illustrations.push({
                    caption: `삽화 ${i}: ${i === 1 ? '이야기의 시작 부분' : '이야기의 결말 부분'}`
                });
            }
        } catch (error) {
            console.error('Illustration generation error:', error);
            illustrations.push({
                caption: `삽화 ${i}: ${i === 1 ? '이야기의 시작 부분' : '이야기의 결말 부분'}`
            });
        }
    }

    return illustrations;
}

function displayStory(team, keywords, storyText, illustrations) {
    const storyOutput = document.getElementById('storyOutput');
    const teamColor = team === 'A' ? '#667eea' : '#f5576c';
    const teamName = team === 'A' ? 'A팀' : 'B팀';
    
    storyOutput.innerHTML = `
        <div class="story-container">
            <div class="story-header">
                <h2 style="color: ${teamColor};">${teamName}의 동화</h2>
            </div>
            
            <div class="keywords-used">
                <h3>📌 사용된 키워드</h3>
                <div class="keyword-tags">
                    ${keywords.map(kw => `<span class="keyword-tag" style="background: ${teamColor};">${kw}</span>`).join('')}
                </div>
            </div>
            
            <div class="story-text">
${storyText}
            </div>
            
            <div class="illustrations">
                ${illustrations.map((ill, index) => `
                    <div class="illustration-item">
                        <div style="
                            width: 100%;
                            height: 300px;
                            background: linear-gradient(135deg, ${teamColor}33 0%, ${teamColor}11 100%);
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 10px;
                            border: 2px dashed ${teamColor}66;
                        ">
                            <span style="color: ${teamColor}; font-size: 3em;">🎨</span>
                        </div>
                        <p>${ill.caption}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    storyOutput.style.display = 'block';
    storyOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}
