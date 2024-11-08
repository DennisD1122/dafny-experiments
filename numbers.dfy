datatype N = zero | succ(n: N)
datatype Z = diff(n1: N, n2: N)
datatype Q = frac(z1: Z, z2: Z)


// NATURALS

predicate equal_N(a: N, b: N)
{
    a == b
}

function add_N(a: N, b: N): N
{
    match a
    case zero => b
    case succ(n) => succ(add_N(n, b))
}

function mult_N(a: N, b: N): N
{
    match a
    case zero => zero
    case succ(n) => add_N(mult_N(n, b), b)
}

lemma lemma_add_commute_N(a: N, b: N)
    ensures equal_N(add_N(a, b), add_N(b, a))
{
    match a
    case zero => {}
    case succ(n) =>
        
}


// INTEGERS

predicate equal_Z(a: Z, b: Z)
{
    equal_N(add_N(a.n1, b.n2), add_N(a.n2, b.n1))
}

function add_Z(a: Z, b: Z): Z
{
    diff(add_N(a.n1, b.n1), add_N(a.n2, b.n2))
}

function mult_Z(a: Z, b: Z): Z
{
    diff(
        add_N(mult_N(a.n1, b.n1), mult_N(a.n2, b.n2)),
        add_N(mult_N(a.n1, b.n2), mult_N(a.n2, b.n1)))
}

lemma lemma_add_commute_Z(a: Z, b: Z)
    ensures equal_Z(add_Z(a, b), add_Z(b, a))
{
    
}


// RATIONALS

predicate equal_Q(a: Q, b: Q)
{
    equal_Z(mult_Z(a.z1, b.z2), mult_Z(a.z2, b.z1))
}
