class InstallmentsUtils {
  calculateInstallmentsWithoutInterest(
    totalValue: number,
    numberOfInstallments: number,
  ): number {
    return totalValue / numberOfInstallments;
  }

  calculateInstallmentsWithInterest(
    totalValue: number,
    numberOfInstallments: number,
    monthlyInterestRate: number,
  ): number {
    const i = monthlyInterestRate;
    const n = numberOfInstallments;
    const PV = totalValue;

    const installment = (PV * i) / (1 - Math.pow(1 + i, -n));
    return installment;
  }
}

export default InstallmentsUtils;
