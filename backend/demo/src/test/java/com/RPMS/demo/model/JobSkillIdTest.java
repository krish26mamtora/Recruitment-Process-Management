package com.RPMS.demo.model;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class JobSkillIdTest {

    private JobSkillId jobSkillId1;
    private JobSkillId jobSkillId2;
    private JobSkillId jobSkillId3;

    @BeforeEach
    void setUp() {
        jobSkillId1 = new JobSkillId(1, 1);
        jobSkillId2 = new JobSkillId(1, 1);
        jobSkillId3 = new JobSkillId(2, 2);
   }

    @Test
    void testConstructorWithParameters() {
        JobSkillId id = new JobSkillId(3, 3);

        // Cannot directly access private fields, test via equals/hashCode instead
        JobSkillId id2 = new JobSkillId(3, 3);
        assertEquals(id, id2);
    }

    @Test
    void testEquals_SameObject() {
        assertEquals(jobSkillId1, jobSkillId1);
    }

    @Test
    void testEquals_EqualObjects() {
        assertEquals(jobSkillId1, jobSkillId2);
        assertEquals(jobSkillId2, jobSkillId1);
    }

    @Test
    void testEquals_DifferentObjects() {
        assertNotEquals(jobSkillId1, jobSkillId3);
    }

    @Test
    void testEquals_Null() {
        assertNotEquals(jobSkillId1, null);
    }

    @Test
    void testEquals_DifferentClass() {
        assertNotEquals(jobSkillId1, "string");
    }

    @Test
    void testHashCode_Consistent() {
        assertEquals(jobSkillId1.hashCode(), jobSkillId2.hashCode());
    }

    @Test
    void testHashCode_DifferentObjects() {
        assertNotEquals(jobSkillId1.hashCode(), jobSkillId3.hashCode());
    }

    @Test
    void testDefaultConstructor() {
        JobSkillId defaultId = new JobSkillId();
        assertNotNull(defaultId);
        // Cannot access private fields directly
    }
}
