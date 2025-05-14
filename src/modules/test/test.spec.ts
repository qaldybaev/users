import { ConflictException } from "@nestjs/common"
import devide from "./test"

describe("DIVIDE fn", () => {
    it("4 ni 2 ga bolish", () => {
        const res = devide(4, 2)

        expect(res).toBe(2)
    })
})

test("sonni 0 ga bolish",() => {
    try {
        devide(4,0)

    } catch (error) {
        expect(error).toBeInstanceOf(ConflictException)
        expect(error.message).toBe("0 ga bolish munkun emas")
        
    }
})