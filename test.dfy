function func_nat_sum(n: nat): nat
{
    if n == 0 then 0
    else n + func_nat_sum(n-1)
}

function func_nat_squared_sum(n: nat): nat
{
    if n == 0 then 0
    else n*n + func_nat_squared_sum(n-1)
}

function func_nat_cubed_sum(n: nat): nat
{
    if n == 0 then 0
    else n*n*n + func_nat_cubed_sum(n-1)
}

function func_nat_pairprod_sum(n: nat): nat
{
    if n == 0 then 0
    else n*(n+1) + func_nat_pairprod_sum(n-1)
}

function pow(a: nat, b: nat): nat
{
    if b == 0 then 1
    else a * pow(a, b-1)
}

lemma prop_nat_sum(n: nat)
    ensures func_nat_sum(n) == n * (n+1) / 2
{
}

lemma prop_nat_squared_sum(n: nat)
    ensures func_nat_squared_sum(n) == n * (n+1) * (2*n+1) / 6
{
}

lemma prop_nat_cubed_sum(n: nat)
    ensures func_nat_cubed_sum(n) == n*n * (n+1)*(n+1) / 4
{
}

lemma prop_nat_pairprod_sum(n: nat)
    ensures func_nat_pairprod_sum(n) == n * (n+1) * (n+2) / 3
{
}

lemma prop_1(n: nat)
    ensures (n*n*n + 2*n) % 3 == 0
{
    if n > 0
    {
        var k := n-1;
        prop_1(k);
        assert n*n*n + 2*n == k*k*k + 2*k + 3*(k*k + k + 1);
    }
}

lemma prop_2(n: nat)
    ensures (pow(9, n) - 1) % 8 == 0
{
}

lemma prop_3(n: nat)
    ensures pow(2, n+1) > n*n
{
    if n > 2
    {
        var k := n-1;
        prop_3(k);
        assert pow(2, n) > 2*n;
    }
}
