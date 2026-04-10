
export const calculateAmortization = (principal, annualRate, emi, extraPayment = 0) => {
    const monthlyRate = annualRate / 12 / 100;
    let balance = principal - Number(extraPayment); // Apply extra payment to current principal
    let schedule = [];
    let totalInterest = 0;
    let month = 1;


    const maxMonths = 600;

    while (balance > 0 && month <= maxMonths) {
        let interestValue = balance * monthlyRate;
        let principalValue = emi - interestValue;


        if (balance < principalValue) {
            principalValue = balance;
        }

        let closingBalance = balance - principalValue;

        schedule.push({
            month,
            openingBalance: Math.round(balance),
            emi: Math.round(interestValue + principalValue),
            interest: Math.round(interestValue),
            principal: Math.round(principalValue),
            closingBalance: Math.max(0, Math.round(closingBalance))
        });

        totalInterest += interestValue;
        balance = closingBalance;
        month++;
    }

    return {
        schedule,
        totalInterest: Math.round(totalInterest),
        tenureMonths: schedule.length,
        totalAmount: Math.round(principal + totalInterest)
    };
};


export const getSmartInsight = (loan, currentSchedule) => {

    if (!loan || !currentSchedule || !currentSchedule.schedule || currentSchedule.schedule.length === 0) {
        return null;
    }


    const nextPayment = currentSchedule.schedule[0];
    const interestBurden = (nextPayment.interest / nextPayment.emi) * 100;

    let recommendation = {
        extra: 0,
        title: "",
        text: "",
        type: "primary",
        impact: null
    };


    const roundToNearest = (num) => Math.round(num / 500) * 500 || 500;

    if (interestBurden <= 10) {
        recommendation.extra = roundToNearest(loan.amount * 0.01);
        recommendation.title = "✅ Loan Health: Excellent";
        recommendation.text = "Your interest burden is minimal. A small 1% top-up will clear this debt even faster.";
        recommendation.type = "success";
    }
    else if (interestBurden <= 25) {
        recommendation.extra = roundToNearest(loan.amount * 0.03);
        recommendation.title = "💡 Optimization Opportunity";
        recommendation.text = "You're in the standard zone. A 3% principal payment can shave off several months of debt.";
        recommendation.type = "info";
    }
    else if (interestBurden <= 45) {
        recommendation.extra = roundToNearest(loan.amount * 0.06);
        recommendation.title = "⚠️ High Interest Burden";
        recommendation.text = "A significant part of your EMI is going toward interest. We suggest a 6% boost to protect your savings.";
        recommendation.type = "warning";
    }
    else {

        recommendation.extra = roundToNearest(loan.amount * 0.10);
        recommendation.title = "🔥 Interest Trap Alert!";
        recommendation.text = "You are paying massive interest! A 10% principal reduction is strongly advised to break the cycle.";
        recommendation.type = "danger";
    }


    const simulated = calculateAmortization(loan.amount, loan.rate, loan.emi, recommendation.extra);

    recommendation.impact = {
        monthsSaved: currentSchedule.tenureMonths - simulated.tenureMonths,
        moneySaved: Math.max(0, currentSchedule.totalInterest - simulated.totalInterest)
    };

    return recommendation;
};