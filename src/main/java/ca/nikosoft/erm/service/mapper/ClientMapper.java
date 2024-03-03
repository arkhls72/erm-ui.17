package ca.nikosoft.erm.service.mapper;

import ca.nikosoft.erm.domain.Client;
import ca.nikosoft.erm.service.dto.ClientDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Client} and its DTO {@link ClientDTO}.
 */
@Mapper(componentModel = "spring")
public interface ClientMapper extends EntityMapper<ClientDTO, Client> {}
