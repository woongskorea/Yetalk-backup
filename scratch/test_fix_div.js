const fs = require('fs');
let html = fs.readFileSync('assets/index.html', 'utf8');

// Insert missing </div> right before <!-- 1. 교우 회원가입 모달 -->
const target = `            </div>

        </div>
    </div>

    <!-- 1. 교우 회원가입 모달 -->`;

const replacement = `            </div>

        </div>
    </div>
    </div>

    <!-- 1. 교우 회원가입 모달 -->`;

console.log('Does html contain target?', html.includes(target));
