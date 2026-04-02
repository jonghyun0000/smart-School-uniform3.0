'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ShoppingCart, Home, AlertCircle } from 'lucide-react';
import { useCustomer } from '@/app/customer/CustomerContext';
import type { CartItem } from '@/types/database';

// ─────────────────────────────────────────────
// 주문 유형별 설정 상수
// ─────────────────────────────────────────────
type OrderTypeKey = '교복구매' | '체육복구매' | '명찰구매';

interface OrderTypeConfig {
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  bgColor: string;
}

const ORDER_TYPE_CONFIG: Record<OrderTypeKey, OrderTypeConfig> = {
  교복구매: {
    title: '교복 주문',
    subtitle: '동복·하복 교복을 주문합니다',
    emoji: '👔',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
  체육복구매: {
    title: '체육복 주문',
    subtitle: '체육복 상·하의를 주문합니다',
    emoji: '🏃',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  명찰구매: {
    title: '명찰 주문',
    subtitle: '천명찰·부착명찰을 주문합니다',
    emoji: '🏷️',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
};

const UNIFORM_SIZES = ['85', '90', '95', '100', '105', '110', '115', '120'];
const BOTTOM_SIZES  = ['55', '60', '65', '70', '75', '80', '85', '90'];
const PE_SIZES      = ['S', 'M', 'L', 'XL', 'XXL', '100', '105', '110'];

// ─────────────────────────────────────────────
// 유효한 OrderType 여부 확인
// ─────────────────────────────────────────────
function isValidOrderType(type: string | null): type is OrderTypeKey {
  return type === '교복구매' || type === '체육복구매' || type === '명찰구매';
}

// ─────────────────────────────────────────────
// 공통 입력 컴포넌트
// ─────────────────────────────────────────────
function Field({
  label, required, children,
}: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  placeholder, value, onChange, type = 'text', inputMode,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-14 px-4 rounded-2xl border-2 border-gray-200 text-base bg-white outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100 transition-all"
    />
  );
}

function SizeGrid({
  sizes, selected, onSelect, color = 'rose',
}: {
  sizes: string[];
  selected: string;
  onSelect: (s: string) => void;
  color?: 'rose' | 'blue' | 'yellow';
}) {
  const activeClass = {
    rose:   'border-rose-500 bg-rose-50 text-rose-700',
    blue:   'border-blue-500 bg-blue-50 text-blue-700',
    yellow: 'border-yellow-500 bg-yellow-50 text-yellow-700',
  }[color];

  return (
    <div className="grid grid-cols-5 gap-2">
      {sizes.map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className={`h-12 rounded-xl border-2 font-semibold text-sm transition-all active:scale-95 ${
            selected === s ? activeClass : 'border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// 유형별 옵션 폼
// ─────────────────────────────────────────────
interface UniformFormState {
  uniformType: '동복' | '하복' | '';
  topSize: string;
  bottomSize: string;
  hasVest: boolean;
}

function UniformForm({
  state, onChange,
}: {
  state: UniformFormState;
  onChange: (s: UniformFormState) => void;
}) {
  return (
    <div className="space-y-5">
      {/* 동복 / 하복 */}
      <Field label="교복 종류" required>
        <div className="grid grid-cols-2 gap-3">
          {(['동복', '하복'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...state, uniformType: t })}
              className={`h-14 rounded-2xl border-2 font-bold text-base transition-all active:scale-95 ${
                state.uniformType === t
                  ? 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              {t === '동복' ? '🧥 동복' : '👕 하복'}
            </button>
          ))}
        </div>
      </Field>

      {/* 상의 사이즈 */}
      <Field label="상의 사이즈" required>
        <SizeGrid
          sizes={UNIFORM_SIZES}
          selected={state.topSize}
          onSelect={s => onChange({ ...state, topSize: s })}
          color="rose"
        />
      </Field>

      {/* 하의 사이즈 */}
      <Field label="하의 사이즈" required>
        <SizeGrid
          sizes={BOTTOM_SIZES}
          selected={state.bottomSize}
          onSelect={s => onChange({ ...state, bottomSize: s })}
          color="rose"
        />
      </Field>

      {/* 조끼 여부 */}
      <Field label="조끼 포함">
        <button
          type="button"
          onClick={() => onChange({ ...state, hasVest: !state.hasVest })}
          className={`h-14 rounded-2xl border-2 font-semibold text-base transition-all flex items-center justify-between px-5 active:scale-95 ${
            state.hasVest
              ? 'border-rose-500 bg-rose-50 text-rose-700'
              : 'border-gray-200 text-gray-600'
          }`}
        >
          <span>조끼 포함</span>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            state.hasVest ? 'bg-rose-500 border-rose-500' : 'border-gray-300'
          }`}>
            {state.hasVest && <span className="text-white text-xs font-bold">✓</span>}
          </div>
        </button>
      </Field>
    </div>
  );
}

interface PEFormState {
  topSize: string;
  bottomSize: string;
  quantity: number;
}

function PEForm({
  state, onChange,
}: {
  state: PEFormState;
  onChange: (s: PEFormState) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="상의 사이즈" required>
        <SizeGrid
          sizes={PE_SIZES}
          selected={state.topSize}
          onSelect={s => onChange({ ...state, topSize: s })}
          color="blue"
        />
      </Field>

      <Field label="하의 사이즈" required>
        <SizeGrid
          sizes={PE_SIZES}
          selected={state.bottomSize}
          onSelect={s => onChange({ ...state, bottomSize: s })}
          color="blue"
        />
      </Field>

      <Field label="수량" required>
        <div className="flex items-center gap-0 border-2 border-gray-200 rounded-xl overflow-hidden w-fit">
          <button
            type="button"
            onClick={() => onChange({ ...state, quantity: Math.max(1, state.quantity - 1) })}
            className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            −
          </button>
          <span className="w-14 text-center font-bold text-gray-900 text-xl">{state.quantity}</span>
          <button
            type="button"
            onClick={() => onChange({ ...state, quantity: Math.min(99, state.quantity + 1) })}
            className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            +
          </button>
        </div>
      </Field>
    </div>
  );
}

interface NameplateFormState {
  printName: string;
  quantity: number;
  tagType: '천명찰' | '부착명찰';
}

function NameplateForm({
  state, onChange,
}: {
  state: NameplateFormState;
  onChange: (s: NameplateFormState) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="명찰 종류" required>
        <div className="grid grid-cols-2 gap-3">
          {(['천명찰', '부착명찰'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ ...state, tagType: t })}
              className={`h-14 rounded-2xl border-2 font-bold text-sm transition-all active:scale-95 ${
                state.tagType === t
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-gray-200 text-gray-600'
              }`}
            >
              {t === '천명찰' ? '🏷️ 천명찰 (2,000원)' : '📌 부착명찰 (2,000원)'}
            </button>
          ))}
        </div>
      </Field>

      <Field label="명찰에 새길 이름" required>
        <TextInput
          placeholder="예: 홍길동 1학년 3반 15번"
          value={state.printName}
          onChange={v => onChange({ ...state, printName: v })}
        />
      </Field>

      <Field label="수량" required>
        <div className="flex items-center gap-0 border-2 border-gray-200 rounded-xl overflow-hidden w-fit">
          <button
            type="button"
            onClick={() => onChange({ ...state, quantity: Math.max(1, state.quantity - 1) })}
            className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            −
          </button>
          <span className="w-14 text-center font-bold text-gray-900 text-xl">{state.quantity}</span>
          <button
            type="button"
            onClick={() => onChange({ ...state, quantity: Math.min(10, state.quantity + 1) })}
            className="w-14 h-14 flex items-center justify-center text-2xl font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            +
          </button>
        </div>
      </Field>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 주문 페이지 (useSearchParams 내부)
// ─────────────────────────────────────────────
function OrderPageInner() {
  const router  = useRouter();
  const params  = useSearchParams();
  const rawType = params.get('type');
  const { dispatch } = useCustomer();

  // 공통 고객 정보
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const [school, setSchool] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // 유형별 폼 상태
  const [uniformState, setUniformState] = useState<UniformFormState>({
    uniformType: '', topSize: '', bottomSize: '', hasVest: false,
  });
  const [peState, setPeState] = useState<PEFormState>({
    topSize: '', bottomSize: '', quantity: 1,
  });
  const [nameplateState, setNameplateState] = useState<NameplateFormState>({
    printName: '', quantity: 1, tagType: '천명찰',
  });

  // 잘못된 type 처리
  if (!isValidOrderType(rawType)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center gap-5">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 mb-1">올바르지 않은 주문 유형입니다.</p>
          <p className="text-sm text-gray-500">
            {rawType ? `"${rawType}"은(는) 존재하지 않는 주문 유형입니다.` : '주문 유형이 지정되지 않았습니다.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/customer')}
          className="flex items-center gap-2 h-12 px-6 bg-rose-600 text-white font-bold rounded-2xl active:scale-95 transition-transform"
        >
          <Home className="w-4 h-4" />
          고객 홈으로 돌아가기
        </button>
      </div>
    );
  }

  const config = ORDER_TYPE_CONFIG[rawType];

  // ── 유효성 검사 ──────────────────────────
  const validate = (): string | null => {
    if (!name.trim())   return '이름을 입력해주세요.';
    if (!phone.trim())  return '연락처를 입력해주세요.';
    if (phone.replace(/\D/g, '').length < 10) return '올바른 연락처를 입력해주세요.';
    if (!school.trim()) return '학교명을 입력해주세요.';

    if (rawType === '교복구매') {
      if (!uniformState.uniformType) return '동복/하복을 선택해주세요.';
      if (!uniformState.topSize)     return '상의 사이즈를 선택해주세요.';
      if (!uniformState.bottomSize)  return '하의 사이즈를 선택해주세요.';
    }
    if (rawType === '체육복구매') {
      if (!peState.topSize)    return '체육복 상의 사이즈를 선택해주세요.';
      if (!peState.bottomSize) return '체육복 하의 사이즈를 선택해주세요.';
    }
    if (rawType === '명찰구매') {
      if (!nameplateState.printName.trim()) return '명찰에 새길 이름을 입력해주세요.';
    }
    return null;
  };

  // ── 장바구니 담기 ────────────────────────
  // TODO: 실제 cart 연동 시 이 함수를 수정하세요
  // dispatch({ type: 'ADD_TO_CART', payload: CartItem }) 형태로 연동
  const handleAddToCart = () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    // 주문 유형별 cart item 구성
    // 추후 실제 product_id / variant_id 는 Supabase에서 조회 후 채워야 함
    const baseInfo = { name, phone, school };

    if (rawType === '교복구매') {
      // 연동 포인트: uniformState.uniformType, topSize, bottomSize, hasVest
      console.log('[cart] 교복구매', { ...baseInfo, ...uniformState });
      const items: CartItem[] = [
        {
          product_id:      `uniform-top-${uniformState.uniformType}`,
          variant_id:      `uniform-top-${uniformState.uniformType}-${uniformState.topSize}`,
          product_name:    `교복 상의(${uniformState.uniformType}) ${uniformState.topSize}`,
          category:        '교복상의',
          size:            uniformState.topSize,
          quantity:        1,
          unit_price:      uniformState.uniformType === '동복' ? 116000 : 54000,
          total_price:     uniformState.uniformType === '동복' ? 116000 : 54000,
          available_stock: 99,
        },
        {
          product_id:      `uniform-bottom-${uniformState.uniformType}`,
          variant_id:      `uniform-bottom-${uniformState.uniformType}-${uniformState.bottomSize}`,
          product_name:    `교복 하의(${uniformState.uniformType}) ${uniformState.bottomSize}`,
          category:        '교복하의',
          size:            uniformState.bottomSize,
          quantity:        1,
          unit_price:      uniformState.uniformType === '동복' ? 75000 : 62000,
          total_price:     uniformState.uniformType === '동복' ? 75000 : 62000,
          available_stock: 99,
        },
      ];
      if (uniformState.hasVest) {
        items.push({
          product_id:      'uniform-vest',
          variant_id:      `uniform-vest-${uniformState.topSize}`,
          product_name:    `조끼 ${uniformState.topSize}`,
          category:        '조끼',
          size:            uniformState.topSize,
          quantity:        1,
          unit_price:      54000,
          total_price:     54000,
          available_stock: 99,
        });
      }
      // dispatch 연동 포인트 ↓
      items.forEach(item => dispatch({ type: 'ADD_TO_CART', payload: item }));
    }

    if (rawType === '체육복구매') {
      console.log('[cart] 체육복구매', { ...baseInfo, ...peState });
      const items: CartItem[] = [
        {
          product_id:      'pe-top',
          variant_id:      `pe-top-${peState.topSize}`,
          product_name:    `체육복 상의 ${peState.topSize}`,
          category:        '체육복상의',
          size:            peState.topSize,
          quantity:        peState.quantity,
          unit_price:      89000,
          total_price:     89000 * peState.quantity,
          available_stock: 99,
        },
        {
          product_id:      'pe-bottom',
          variant_id:      `pe-bottom-${peState.bottomSize}`,
          product_name:    `체육복 하의 ${peState.bottomSize}`,
          category:        '체육복하의',
          size:            peState.bottomSize,
          quantity:        peState.quantity,
          unit_price:      89000,
          total_price:     89000 * peState.quantity,
          available_stock: 99,
        },
      ];
      items.forEach(item => dispatch({ type: 'ADD_TO_CART', payload: item }));
    }

    if (rawType === '명찰구매') {
      console.log('[cart] 명찰구매', { ...baseInfo, ...nameplateState });
      const item: CartItem = {
        product_id:      `nameplate-${nameplateState.tagType}`,
        variant_id:      `nameplate-${nameplateState.tagType}-${Date.now()}`,
        product_name:    `${nameplateState.tagType} - ${nameplateState.printName}`,
        category:        '명찰',
        size:            nameplateState.tagType,
        quantity:        nameplateState.quantity,
        unit_price:      2000,
        total_price:     2000 * nameplateState.quantity,
        available_stock: 999,
      };
      dispatch({ type: 'ADD_TO_CART', payload: item });
    }

    setSubmitted(true);
  };

  // ── 장바구니 담기 성공 화면 ───────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="text-6xl">🛒</div>
        <div>
          <p className="text-2xl font-black text-gray-900 mb-2">장바구니에 담았어요!</p>
          <p className="text-gray-500 text-sm">장바구니에서 최종 주문을 완료해주세요.</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <button
            type="button"
            onClick={() => router.push('/customer/cart')}
            className="h-14 bg-rose-600 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <ShoppingCart className="w-5 h-5" />
            장바구니 보기
          </button>
          <button
            type="button"
            onClick={() => router.push('/customer')}
            className="h-14 bg-gray-100 text-gray-700 font-bold text-base rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Home className="w-5 h-5" />
            고객 홈으로
          </button>
        </div>
      </div>
    );
  }

  // ── 메인 폼 ─────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      {/* 탑바 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 h-14 flex items-center px-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 -ml-2"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-gray-900 mr-10">
          {config.title}
        </h1>
      </div>

      {/* 헤더 배너 */}
      <div className={`${config.bgColor} px-5 py-4 flex items-center gap-3`}>
        <span className="text-3xl">{config.emoji}</span>
        <div>
          <p className={`font-bold text-base ${config.color}`}>{config.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">{config.subtitle}</p>
        </div>
      </div>

      {/* 폼 본문 */}
      <div className="px-4 py-5 space-y-6 pb-36">
        {/* 고객 정보 */}
        <section className="space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">고객 정보</p>
          <Field label="이름" required>
            <TextInput
              placeholder="홍길동"
              value={name}
              onChange={setName}
            />
          </Field>
          <Field label="연락처 (학부모)" required>
            <TextInput
              placeholder="010-0000-0000"
              value={phone}
              onChange={setPhone}
              type="tel"
              inputMode="tel"
            />
          </Field>
          <Field label="학교명" required>
            <TextInput
              placeholder="예: 춘천중학교"
              value={school}
              onChange={setSchool}
            />
          </Field>
        </section>

        {/* 구분선 */}
        <div className="border-t border-gray-100" />

        {/* 유형별 옵션 */}
        <section className="space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">주문 옵션</p>
          {rawType === '교복구매'  && <UniformForm  state={uniformState}  onChange={setUniformState} />}
          {rawType === '체육복구매' && <PEForm        state={peState}       onChange={setPeState} />}
          {rawType === '명찰구매'  && <NameplateForm state={nameplateState} onChange={setNameplateState} />}
        </section>

        {/* 안내 */}
        <div className="bg-amber-50 rounded-2xl p-4 text-xs text-amber-700 space-y-1">
          <p className="font-bold">📢 안내사항</p>
          {rawType === '교복구매'  && <p>교복·체육복 이월제품 20% 할인 가능 · 결제는 매장 직원에게 문의</p>}
          {rawType === '체육복구매' && <p>기모체육복 96,000원 · 이월제품 20% 할인 가능</p>}
          {rawType === '명찰구매'  && <p>천명찰·부착명찰 각 2,000원 · 리본·타이류 별도 5,000원</p>}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-16 left-0 right-0 max-w-2xl mx-auto px-4 pb-4 bg-white border-t border-gray-100 pt-3 space-y-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full h-14 font-bold text-base rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform text-white ${
            rawType === '교복구매'  ? 'bg-rose-600' :
            rawType === '체육복구매' ? 'bg-blue-600' :
            'bg-yellow-500'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          장바구니 담기
        </button>
        <button
          type="button"
          onClick={() => router.push('/customer')}
          className="w-full h-11 bg-gray-100 text-gray-600 font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Home className="w-4 h-4" />
          고객 홈으로
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Suspense 래핑 (useSearchParams 요구사항)
// ─────────────────────────────────────────────
export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-400 text-sm animate-pulse">불러오는 중...</div>
        </div>
      }
    >
      <OrderPageInner />
    </Suspense>
  );
}
